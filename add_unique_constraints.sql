-- 2回目実行: UNIQUE制約を追加してupsert処理を正常に動作させる

-- 制約を安全に追加するための関数（存在しない場合のみ追加）
DO $$
BEGIN
    -- group_start_sectionsテーブルのsection_idにUNIQUE制約を追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_group_start_section_id'
    ) THEN
        ALTER TABLE group_start_sections 
        ADD CONSTRAINT unique_group_start_section_id UNIQUE (section_id);
    END IF;

    -- group_end_sectionsテーブルのsection_idにUNIQUE制約を追加  
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_group_end_section_id'
    ) THEN
        ALTER TABLE group_end_sections
        ADD CONSTRAINT unique_group_end_section_id UNIQUE (section_id);
    END IF;

    -- 他のセクションテーブルにもUNIQUE制約を追加（念のため）
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_main_visual_section_id'
    ) THEN
        ALTER TABLE main_visual_sections
        ADD CONSTRAINT unique_main_visual_section_id UNIQUE (section_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_img_text_section_id'
    ) THEN
        ALTER TABLE img_text_sections
        ADD CONSTRAINT unique_img_text_section_id UNIQUE (section_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_cards_section_id'
    ) THEN
        ALTER TABLE cards_sections
        ADD CONSTRAINT unique_cards_section_id UNIQUE (section_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_form_section_id'
    ) THEN
        ALTER TABLE form_sections
        ADD CONSTRAINT unique_form_section_id UNIQUE (section_id);
    END IF;
END $$;

-- 完了メッセージ
SELECT 'UNIQUE制約の追加が完了しました。upsert処理でのPostgreSQLエラー42P10が解決されました。' AS message; 