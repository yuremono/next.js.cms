-- テスト用：image_aspect_ratioを4/3に設定するSQLスクリプト

-- 1. main_visual_sectionsの最初の1件を4/3に更新
UPDATE public.main_visual_sections 
SET image_aspect_ratio = '4/3' 
WHERE section_id = (
    SELECT section_id 
    FROM public.main_visual_sections 
    LIMIT 1
);

-- 2. img_text_sectionsの最初の1件を4/3に更新
UPDATE public.img_text_sections 
SET image_aspect_ratio = '4/3' 
WHERE section_id = (
    SELECT section_id 
    FROM public.img_text_sections 
    LIMIT 1
);

-- 3. cardsの最初の1件を4/3に更新
UPDATE public.cards 
SET image_aspect_ratio = '4/3' 
WHERE id = (
    SELECT id 
    FROM public.cards 
    LIMIT 1
);

-- 確認用クエリ
SELECT 'main_visual_sections' as table_name, section_id::text, image_aspect_ratio 
FROM public.main_visual_sections 
WHERE image_aspect_ratio = '4/3'
UNION ALL
SELECT 'img_text_sections' as table_name, section_id::text, image_aspect_ratio 
FROM public.img_text_sections 
WHERE image_aspect_ratio = '4/3'
UNION ALL
SELECT 'cards' as table_name, id::text, image_aspect_ratio 
FROM public.cards 
WHERE image_aspect_ratio = '4/3'; 