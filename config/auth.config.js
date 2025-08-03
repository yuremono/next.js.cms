/**
 * CMS認証設定
 * ここで認証に関する設定を一括管理できます
 */

const authConfig = {
  // 🔐 CMSアクセスパスワード（廃止）
  // 権限レベル別のパスワードを環境変数で設定してください
  // CMS_PASSWORD_EDIT: 編集権限, CMS_PASSWORD_VIEW: 閲覧権限
  defaultPassword: null, // セキュリティ向上のため無効化

  // ⏰ セッション維持時間（秒）
  // 3600 = 1時間, 7200 = 2時間, 86400 = 24時間
  sessionDuration: 3600,

  // 🚫 認証スキップ（開発時のみ）
  // true にすると認証なしでアクセス可能
  skipAuthInDev: false,

  // 🎨 認証画面のカスタマイズ
  ui: {
    title: "ポートフォリオCMS - 企業様向け",
    subtitle: "編集機能をご利用いただくため、パスワードを入力してください",
    companyMessage:
      "このシステムは企業様向けのポートフォリオCMSです。\nパスワードをお持ちでない場合は、担当者にお問い合わせください。",
  },
};

export default authConfig;
module.exports = authConfig;
