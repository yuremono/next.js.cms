-- テーブルにimageClassとtextClassカラムを追加するためのSQLスクリプト

-- main_visual_sectionsテーブルに追加
ALTER TABLE main_visual_sections
ADD COLUMN IF NOT EXISTS image_class TEXT,
ADD COLUMN IF NOT EXISTS text_class TEXT;

-- img_text_sectionsテーブルに追加
ALTER TABLE img_text_sections
ADD COLUMN IF NOT EXISTS image_class TEXT,
ADD COLUMN IF NOT EXISTS text_class TEXT;

-- cardsテーブルに追加
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS image_class TEXT,
ADD COLUMN IF NOT EXISTS text_class TEXT;

-- カラム追加の確認メッセージ
DO $$
BEGIN
  RAISE NOTICE 'カラム追加が完了しました。';
END $$; 