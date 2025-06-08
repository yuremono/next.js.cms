-- image_aspect_ratioカラムを追加するSQLスクリプト
-- 画像のアスペクト比を保存するためのカラムを各テーブルに追加

-- 1. main_visual_sectionsテーブルにimage_aspect_ratioカラムを追加
ALTER TABLE public.main_visual_sections 
ADD COLUMN image_aspect_ratio text DEFAULT 'auto';

-- 2. img_text_sectionsテーブルにimage_aspect_ratioカラムを追加
ALTER TABLE public.img_text_sections 
ADD COLUMN image_aspect_ratio text DEFAULT 'auto';

-- 3. cardsテーブルにimage_aspect_ratioカラムを追加
ALTER TABLE public.cards 
ADD COLUMN image_aspect_ratio text DEFAULT 'auto';

-- コメント追加（オプション）
COMMENT ON COLUMN public.main_visual_sections.image_aspect_ratio IS '画像のアスペクト比（例: "16/9", "4/3", "auto"）';
COMMENT ON COLUMN public.img_text_sections.image_aspect_ratio IS '画像のアスペクト比（例: "16/9", "4/3", "auto"）';
COMMENT ON COLUMN public.cards.image_aspect_ratio IS '画像のアスペクト比（例: "16/9", "4/3", "auto"）';

-- 実行後に確認
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name IN ('main_visual_sections', 'img_text_sections', 'cards') 
-- AND column_name = 'image_aspect_ratio'; 