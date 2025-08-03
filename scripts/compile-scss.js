const sass = require('sass');
const fs = require('fs');
const path = require('path');

// SCSSファイルをCSSにコンパイルする関数
function compileSCSS() {
  try {
    // app/top.scssを読み込み、app/scss/common_style.scssを@useで追加
    const scssContent = `
@use "scss/common_style" as *;

${fs.readFileSync(path.join(process.cwd(), 'app/top.scss'), 'utf8')}
    `.trim();

    // 一時的なSCSSファイルを作成
    const tempScssPath = path.join(process.cwd(), 'temp-compiled.scss');
    fs.writeFileSync(tempScssPath, scssContent);

    // SASSコンパイル
    const result = sass.compile(tempScssPath, {
      loadPaths: [path.join(process.cwd(), 'app')],
      style: 'expanded'
    });

    // コンパイル結果をpublic/compiled.cssに保存
    const outputPath = path.join(process.cwd(), 'public/compiled.css');
    fs.writeFileSync(outputPath, result.css);

    // 一時ファイルを削除
    fs.unlinkSync(tempScssPath);

    console.log('✅ SCSS compilation successful: public/compiled.css');
  } catch (error) {
    console.error('❌ SCSS compilation failed:', error);
  }
}

// 実行
compileSCSS(); 