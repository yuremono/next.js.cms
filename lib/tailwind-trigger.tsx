/**
 * Tailwind CSS Trigger
 * 
 * このファイルは、Tailwind CSSのパージ（未使用クラスの削除）を防ぐためのトリガーです。
 * CMSのデータベースから動的に読み込まれるHTMLで使用する可能性のあるクラスをここに記述することで、
 * 本番環境のCSSビルドに含まれるようになります。
 * 
 * 実際にはどこからもインポートされる必要はありません。
 */

// レイアウト系
const layoutClasses = "text-left text-center text-right block inline-block flex grid items-center justify-center justify-between";

// テキスト・装飾系
const textClasses = "leading-[0.75em] font-bold font-light italic underline line-through uppercase lowercase capitalize bg-no-repeat";

// RTL/LTR関連
const directionClasses = "ltr rtl text-start text-end";

// スペース系（よく使うもの）
const spaceClasses = "m-0 m-1 m-2 m-4 p-0 p-1 p-2 p-4 gap-1 gap-2 gap-4";

// すべてを統合したトリガーストラップ
export const tailwindTrigger = `${layoutClasses} ${textClasses} ${directionClasses} ${spaceClasses}`;
