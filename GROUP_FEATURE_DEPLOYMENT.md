# 🚀 グループ機能デプロイメント手順書

## 📋 概要
グループ機能（`group-start`、`group-end`セクション）を本番環境に適用するための手順書です。

## ⚠️ 重要な注意事項
- **データベース操作が必要です**
- **本番環境での作業前に必ずバックアップを取得してください**
- **作業は低トラフィック時間帯に実行することを推奨します**

## 🔧 必要な作業

### 1. データベーススキーマ更新（必須）

#### Supabase環境での実行
```sql
-- 以下のSQLを Supabase Dashboard > SQL Editor で実行してください
-- ファイル: add_group_sections_support.sql の内容をコピー&ペースト

-- 1. sectionsテーブルのtype列にグループタイプを追加
ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_type_check;
ALTER TABLE sections ADD CONSTRAINT sections_type_check 
CHECK (type IN ('mainVisual', 'imgText', 'cards', 'form', 'group-start', 'group-end'));

-- 2. group_start_sectionsテーブルを作成
CREATE TABLE IF NOT EXISTS group_start_sections (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  class TEXT NOT NULL DEFAULT '',
  bg_image TEXT,
  name TEXT NOT NULL DEFAULT 'グループ',
  scope_styles TEXT,
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

-- 4. インデックスを追加
CREATE INDEX IF NOT EXISTS idx_group_start_sections_section_id ON group_start_sections(section_id);
CREATE INDEX IF NOT EXISTS idx_group_end_sections_section_id ON group_end_sections(section_id);
```

#### 実行確認
```sql
-- 実行後、以下のクエリで確認
SELECT 
  'group_start_sections' as table_name, 
  COUNT(*) as record_count 
FROM group_start_sections
UNION ALL
SELECT 
  'group_end_sections' as table_name, 
  COUNT(*) as record_count 
FROM group_end_sections;
```

### 2. アプリケーションデプロイ

#### 修正されたファイル一覧
- ✅ `components/SortableSections.tsx` - ドラッグ順序修正
- ✅ `lib/security.ts` - バリデーションスキーマ更新
- ✅ `app/api/page/route.ts` - API処理追加
- ✅ `app/page.tsx` - トップページ処理追加
- ✅ `types/index.ts` - 型定義（既存）
- ✅ `components/sections/GroupEditor.tsx` - エディタ（既存）
- ✅ `components/PageRenderer.tsx` - レンダリング（既存）

#### デプロイ手順
```bash
# 1. 変更をコミット
git add .
git commit -m "feat: グループ機能のデータベース対応とドラッグ順序修正"

# 2. 本番環境にデプロイ
git push origin main
# または使用しているデプロイ方法に従って実行
```

### 3. 動作確認

#### 確認項目
- [ ] **グループセクション追加**: エディタでグループセクションが追加できる
- [ ] **グループドラッグ**: グループ全体のドラッグ&ドロップが正常動作
- [ ] **グループ保存**: グループセクションが正常に保存される
- [ ] **グループ表示**: トップページでグループが正常に表示される
- [ ] **グループ編集**: グループ名、スタイルが編集できる
- [ ] **グループ削除**: グループの削除が正常動作

#### テスト手順
1. **エディタアクセス**: `/editor` にアクセス
2. **グループ追加**: 「セクション追加」→「グループ」を選択
3. **グループ編集**: グループ名を変更、CSS変数を設定
4. **セクション追加**: グループ内にセクションを追加
5. **ドラッグテスト**: グループ全体をドラッグして移動
6. **保存確認**: 保存後にページをリロードして確認
7. **表示確認**: トップページでグループが正常表示されることを確認

## 🔄 ロールバック手順

### 問題が発生した場合
```sql
-- 1. 新しいテーブルを削除
DROP TABLE IF EXISTS group_end_sections;
DROP TABLE IF EXISTS group_start_sections;

-- 2. CHECK制約を元に戻す
ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_type_check;
ALTER TABLE sections ADD CONSTRAINT sections_type_check 
CHECK (type IN ('mainVisual', 'imgText', 'cards', 'form'));
```

### アプリケーションのロールバック
```bash
# 前のコミットに戻す
git revert HEAD
git push origin main
```

## 📊 パフォーマンス影響

### 予想される影響
- **データベース**: 新しいテーブル2つ追加（軽微）
- **API**: グループセクション処理追加（軽微）
- **フロントエンド**: ドラッグ&ドロップ処理改善（改善）

### 監視項目
- データベースクエリ実行時間
- API レスポンス時間
- エディタの操作性

## 🎯 今後の拡張予定

### 完了した機能
- ✅ グループセクションの基本機能
- ✅ ドラッグ&ドロップ対応
- ✅ データベース保存・取得
- ✅ エディタ機能

### 今後の改善案
- [ ] グループのネスト対応
- [ ] グループテンプレート機能
- [ ] グループ単位でのコピー&ペースト
- [ ] グループ内セクションの一括操作

## 📞 サポート

### 問題が発生した場合の連絡先
- **技術的問題**: 開発チーム
- **データベース問題**: インフラチーム
- **緊急時**: 24時間サポート

### ログ確認方法
```bash
# アプリケーションログ
tail -f /var/log/app.log

# データベースログ
# Supabase Dashboard > Logs で確認
```

---

**⚠️ 重要**: この手順書に従って作業を行う前に、必ず関係者に作業予定を共有し、バックアップを取得してください。 