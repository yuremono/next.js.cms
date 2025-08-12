const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Sassコンパイルを開始...');

try {
  // public/scss/common.scss を public/compiled.css にコンパイル
  execSync('npx sass public/scss/common.scss public/compiled.css', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Sassコンパイル完了！');
  console.log('📁 出力先: public/compiled.css');
  
} catch (error) {
  console.error('❌ Sassコンパイルエラー:', error.message);
  process.exit(1);
} 