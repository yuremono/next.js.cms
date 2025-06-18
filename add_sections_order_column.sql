-- pages テーブルに sections_order カラムを追加
-- セクション順序を文字列形式 "id1,id2,id3" で管理

ALTER TABLE pages ADD COLUMN sections_order TEXT;

-- 既存データへのコメント
-- 既存のページデータには null が入りますが、フロントエンド側で
-- 自動的にセクション配列から sections_order を生成するため問題ありません 