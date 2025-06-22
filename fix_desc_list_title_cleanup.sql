-- DescListセクションの空白タイトルをクリーンアップするSQL

-- 1回目実行: 現在のdesc_list_sectionsテーブルの構造とデータを確認
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'desc_list_sections' 
ORDER BY ordinal_position;

-- 2回目実行: 空白文字のみのタイトルをクリーンアップ
UPDATE desc_list_sections 
SET title = NULL 
WHERE title IS NOT NULL 
  AND trim(title) = '';

-- 3回目実行: 更新結果を確認
SELECT 
  section_id,
  name,
  title,
  CASE 
    WHEN title IS NULL THEN 'NULL'
    WHEN trim(title) = '' THEN 'EMPTY'
    ELSE 'HAS_VALUE'
  END as title_status
FROM desc_list_sections 
ORDER BY section_id; 