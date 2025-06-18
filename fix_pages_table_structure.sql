-- 1回目実行: 現在のテーブル構造を確認してから、新しい構造に変更

-- 既存のpagesテーブルをバックアップ
CREATE TABLE IF NOT EXISTS pages_backup AS SELECT * FROM pages;

-- 新しいpagesテーブル構造を作成
DROP TABLE IF EXISTS pages CASCADE;

CREATE TABLE pages (
  id INTEGER PRIMARY KEY DEFAULT 1,
  header_html TEXT DEFAULT '',
  footer_html TEXT DEFAULT '',
  custom_css TEXT DEFAULT '',
  sections_order TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- デフォルトページデータを挿入
INSERT INTO pages (
  id, 
  header_html, 
  footer_html, 
  custom_css, 
  sections_order
) VALUES (
  1,
  '<header class="bg-white shadow-sm">
  <div class="container mx-auto px-4 py-4 flex justify-between items-center">
    <div class="logo">
      <a href="/" class="text-xl font-bold">サイト名</a>
    </div>
    <nav>
      <ul class="flex space-x-6">
        <li><a href="#" class="hover:text-primary">ホーム</a></li>
        <li><a href="#" class="hover:text-primary">会社概要</a></li>
        <li><a href="#" class="hover:text-primary">サービス</a></li>
        <li><a href="#" class="hover:text-primary">お問い合わせ</a></li>
      </ul>
    </nav>
  </div>
</header>',
  '<footer class="bg-gray-800 text-white">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 class="text-lg font-semibold mb-4">会社名</h3>
        <p>〒123-4567<br />東京都○○区△△ 1-2-3</p>
        <p>TEL: 03-1234-5678</p>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4">リンク</h3>
        <ul class="space-y-2">
          <li><a href="#" class="hover:underline">ホーム</a></li>
          <li><a href="#" class="hover:underline">会社概要</a></li>
          <li><a href="#" class="hover:underline">サービス</a></li>
          <li><a href="#" class="hover:underline">お問い合わせ</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4">SNS</h3>
        <div class="flex space-x-4">
          <a href="#" class="hover:text-primary">Twitter</a>
          <a href="#" class="hover:text-primary">Facebook</a>
          <a href="#" class="hover:text-primary">Instagram</a>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-700 mt-8 pt-4 text-center">
      <p>© 2024 会社名. All rights reserved.</p>
    </div>
  </div>
</footer>',
  ':root {
  --base: 1200px;
  --head: 80px;
  --sectionMT: 80px;
  --titleAfter: 24px;
  --sectionPY: 60px;
  --sectionPX: 20px;
  --gap: 24px;
  --mc: #3b82f6;
  --sc: #64748b;
  --ac: #f59e0b;
  --bc: #ffffff;
  --tx: #1f2937;
}

/* カスタムCSS例 */
.MainVisual {
  background: linear-gradient(135deg, var(--bc) 0%, #f0f8ff 100%);
  padding: var(--sectionPY) var(--sectionPX);
  text-align: center;
}

.ImgText {
  padding: var(--sectionPY) var(--sectionPX);
  background-color: var(--bc);
  margin-top: var(--sectionMT);
}

.Cards {
  padding: var(--sectionPY) var(--sectionPX);
  background-color: #f5f5f5;
  margin-top: var(--sectionMT);
}

.Cards .grid {
  gap: var(--gap);
}

.Form {
  padding: var(--sectionPY) var(--sectionPX);
  background-color: var(--bc);
  margin-top: var(--sectionMT);
}',
  ''
) ON CONFLICT (id) DO UPDATE SET
  header_html = EXCLUDED.header_html,
  footer_html = EXCLUDED.footer_html,
  custom_css = EXCLUDED.custom_css,
  sections_order = EXCLUDED.sections_order,
  updated_at = NOW();

-- セクション関連テーブルが存在しない場合は作成
CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mainVisual', 'imgText', 'cards', 'form', 'group-start', 'group-end')),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 各セクションタイプ別テーブル
CREATE TABLE IF NOT EXISTS main_visual_sections (
  section_id INTEGER PRIMARY KEY REFERENCES sections(id) ON DELETE CASCADE,
  class TEXT DEFAULT '',
  bg_image TEXT DEFAULT '',
  name TEXT DEFAULT '',
  html TEXT DEFAULT '',
  image TEXT DEFAULT '',
  image_class TEXT DEFAULT '',
  text_class TEXT DEFAULT '',
  image_aspect_ratio TEXT DEFAULT 'auto',
  section_width TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS img_text_sections (
  section_id INTEGER PRIMARY KEY REFERENCES sections(id) ON DELETE CASCADE,
  class TEXT DEFAULT '',
  bg_image TEXT DEFAULT '',
  name TEXT DEFAULT '',
  html TEXT DEFAULT '',
  image TEXT DEFAULT '',
  image_class TEXT DEFAULT '',
  text_class TEXT DEFAULT '',
  image_aspect_ratio TEXT DEFAULT 'auto',
  section_width TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS cards_sections (
  section_id INTEGER PRIMARY KEY REFERENCES sections(id) ON DELETE CASCADE,
  class TEXT DEFAULT '',
  bg_image TEXT DEFAULT '',
  name TEXT DEFAULT '',
  section_width TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  cards_section_id INTEGER REFERENCES cards_sections(section_id) ON DELETE CASCADE,
  image TEXT DEFAULT '',
  image_class TEXT DEFAULT '',
  text_class TEXT DEFAULT '',
  html TEXT DEFAULT '',
  position INTEGER DEFAULT 0,
  image_aspect_ratio TEXT DEFAULT 'auto'
);

CREATE TABLE IF NOT EXISTS form_sections (
  section_id INTEGER PRIMARY KEY REFERENCES sections(id) ON DELETE CASCADE,
  class TEXT DEFAULT '',
  bg_image TEXT DEFAULT '',
  name TEXT DEFAULT '',
  html TEXT DEFAULT '',
  endpoint TEXT DEFAULT '',
  section_width TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS group_start_sections (
  section_id INTEGER PRIMARY KEY REFERENCES sections(id) ON DELETE CASCADE,
  class TEXT DEFAULT '',
  bg_image TEXT DEFAULT '',
  name TEXT DEFAULT 'グループ',
  scope_styles TEXT DEFAULT '',
  section_width TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS group_end_sections (
  section_id INTEGER PRIMARY KEY REFERENCES sections(id) ON DELETE CASCADE,
  class TEXT DEFAULT '',
  bg_image TEXT DEFAULT '',
  section_width TEXT DEFAULT ''
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_sections_page_id_position ON sections(page_id, position);
CREATE INDEX IF NOT EXISTS idx_cards_section_position ON cards(cards_section_id, position);

-- 完了メッセージ
SELECT 'テーブル構造の更新が完了しました。custom_cssカラムが追加され、変数設定が保存できるようになりました。' AS message; 