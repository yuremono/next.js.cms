const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 環境変数の読み込み（ローカル実行用）
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function fetchRareClasses() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️ Supabase credentials not found. Skipping rare classes sync.');
    return;
  }

  console.log('🔄 Fetching Rare Classes from Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('pages')
      .select('tailwind_trigger')
      .eq('id', 1)
      .single();

    if (error) throw error;

    const classes = data?.tailwind_trigger || '';
    
    const filePath = path.join(process.cwd(), 'lib/tailwind-trigger.tsx');
    const content = `/**
 * Tailwind CSS Trigger (Generated)
 * 
 * このファイルはビルド時にデータベースから自動生成されます。
 * 直接編集してもビルド時に上書きされるため、CMSの「Rare Classes」画面から編集してください。
 */

// データベースから取得したクラス
const rareClasses = ${JSON.stringify(classes)};

// すべてを統合したトリガーストラップ
export const tailwindTrigger = rareClasses;
`;

    fs.writeFileSync(filePath, content);
    console.log('✅ lib/tailwind-trigger.tsx has been updated with latest rare classes.');
  } catch (error) {
    console.error('❌ Error fetching rare classes:', error.message);
    // ビルドを失敗させないためにエラーをスローしない
  }
}

fetchRareClasses();

