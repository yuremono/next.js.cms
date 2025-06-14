-- グループ機能追加のためのSQLスクリプト
-- group-start と group-end セクションタイプをサポート

-- 1. sectionsテーブルのtype列にグループタイプを追加（既存のCHECK制約を更新）
-- 既存のCHECK制約を削除
ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_type_check;

-- 新しいCHECK制約を追加（グループタイプを含む）
ALTER TABLE sections ADD CONSTRAINT sections_type_check 
CHECK (type IN ('mainVisual', 'imgText', 'cards', 'form', 'group-start', 'group-end'));

-- 2. group_start_sectionsテーブルを作成
CREATE TABLE IF NOT EXISTS group_start_sections (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  class TEXT NOT NULL DEFAULT '',
  bg_image TEXT,
  name TEXT NOT NULL DEFAULT 'グループ',
  scope_styles TEXT, -- CSS変数スタイル（例: "--gap: 2rem; --bg-color: #f0f0f0;"）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. group_end_sectionsテーブルを作成
CREATE TABLE IF NOT EXISTS group_end_sections (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  class TEXT NOT NULL DEFAULT '',
  bg_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. インデックスを追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_group_start_sections_section_id ON group_start_sections(section_id);
CREATE INDEX IF NOT EXISTS idx_group_end_sections_section_id ON group_end_sections(section_id);

-- 5. コメントを追加
COMMENT ON TABLE group_start_sections IS 'グループ開始セクション（<article>タグに対応）';
COMMENT ON TABLE group_end_sections IS 'グループ終了セクション（</article>タグに対応）';
COMMENT ON COLUMN group_start_sections.scope_styles IS 'CSS変数スタイル（例: "--gap: 2rem; --bg-color: #f0f0f0;"）';

-- 6. 既存のvalidationスキーマ更新のためのメモ
-- lib/security.tsのvalidationSchemasで以下を更新する必要があります：
-- layout: z.enum(["mainVisual", "imgText", "cards", "form", "group-start", "group-end"])

-- 実行確認用クエリ
SELECT 
  'group_start_sections' as table_name, 
  COUNT(*) as record_count 
FROM group_start_sections
UNION ALL
SELECT 
  'group_end_sections' as table_name, 
  COUNT(*) as record_count 
FROM group_end_sections;

-- 制約確認用クエリ
SELECT 
  conname as constraint_name,
  consrc as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'sections'::regclass 
AND conname = 'sections_type_check'; 