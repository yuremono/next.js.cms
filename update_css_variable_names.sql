-- CSS変数名変更: --sectionPX を --mainBezel に更新
-- 実行日: 2024年
-- 対象: pagesテーブルのcustom_cssカラム

-- 1回目実行: 現在のデータ確認
SELECT id, custom_css 
FROM pages 
WHERE custom_css LIKE '%--sectionPX%'
ORDER BY id;

-- 2回目実行: CSS変数名を更新
UPDATE pages 
SET custom_css = REPLACE(custom_css, '--sectionPX:', '--mainBezel:')
WHERE custom_css LIKE '%--sectionPX%';

-- 3回目実行: 更新結果確認
SELECT id, custom_css 
FROM pages 
WHERE custom_css LIKE '%--mainBezel%'
ORDER BY id;

-- 4回目実行: 古い変数名が残っていないか確認
SELECT id, custom_css 
FROM pages 
WHERE custom_css LIKE '%--sectionPX%'
ORDER BY id;

-- 実行順序:
-- 1. 1回目実行で現在のデータを確認
-- 2. 2回目実行でCSS変数名を更新
-- 3. 3回目実行で更新結果を確認
-- 4. 4回目実行で古い変数名が残っていないか最終確認 