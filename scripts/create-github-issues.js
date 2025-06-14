const { Octokit } = require("@octokit/rest");

// 環境変数からGitHubトークンを取得
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER || "your-username"; // リポジトリオーナー名
const REPO_NAME = process.env.REPO_NAME || "cms0613"; // リポジトリ名

if (!GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN環境変数が設定されていません");
  process.exit(1);
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// 作成するissueのデータ
const issues = [
  {
    title: "🔧 テスト環境の構築",
    body: `## 概要
転職活動のポートフォリオとして、テスト環境が不足しています。企業の技術面接で必ず評価される重要な機能です。

## 必要な作業

### 1. ユニットテスト
- [ ] Jest/Vitestのセットアップ
- [ ] React Testing Libraryの導入
- [ ] コンポーネントテストの実装
- [ ] ユーティリティ関数のテスト

### 2. 統合テスト
- [ ] API Routes のテスト
- [ ] データベース操作のテスト
- [ ] 認証フローのテスト

### 3. E2Eテスト
- [ ] Playwright/Cypressの導入
- [ ] 主要なユーザーフローのテスト
- [ ] エディタ機能のテスト
- [ ] 認証フローのテスト

## 成功基準
- テストカバレッジ30%以上
- CI/CDでテストが自動実行される
- 主要機能のE2Eテストが通る

## 優先度
🔴 **最高** - 企業面接で必須の評価項目`,
    labels: ["enhancement", "testing", "portfolio", "high-priority"],
  },
  {
    title: "📊 SEO対応の強化",
    body: `## 概要
現在のCMSシステムにはSEO対応が不足しており、企業サイトとしての基本機能が欠けています。

## 必要な作業

### 1. 動的メタタグ
- [ ] ページごとのSEO設定機能
- [ ] title, description, keywordsの編集
- [ ] OGP (Open Graph Protocol) 対応
- [ ] Twitter Card対応

### 2. sitemap.xml
- [ ] 自動生成機能の実装
- [ ] 動的な更新対応
- [ ] 検索エンジンへの送信

### 3. 構造化データ
- [ ] JSON-LD形式の実装
- [ ] 組織・記事・商品データの対応
- [ ] リッチスニペット対応

### 4. その他SEO機能
- [ ] robots.txt の最適化
- [ ] canonical URL の設定
- [ ] 内部リンク最適化

## 成功基準
- Google Search Console で認識される
- Lighthouse SEOスコア90点以上
- 検索結果でリッチスニペット表示される

## 優先度
🟠 **高** - 実務レベルのWebサイトに必須`,
    labels: ["enhancement", "seo", "portfolio", "medium-priority"],
  },
  {
    title: "🚨 エラーハンドリングの実装",
    body: `## 概要
現在のシステムには統一的なエラーハンドリングが不足しており、ユーザビリティに問題があります。

## 必要な作業

### 1. エラーページ
- [ ] \`app/not-found.tsx\` の作成
- [ ] \`app/error.tsx\` の作成
- [ ] \`app/global-error.tsx\` の作成
- [ ] カスタム500エラーページ

### 2. エラーバウンダリ
- [ ] React Error Boundaryの実装
- [ ] コンポーネントレベルでのエラー処理
- [ ] フォールバックUIの設計

### 3. グローバルエラー処理
- [ ] 統一的なエラーレスポンス形式
- [ ] エラーログの収集機能
- [ ] ユーザーフレンドリーなエラーメッセージ

### 4. ネットワークエラー対応
- [ ] オフライン状態の検知
- [ ] リトライ機能の実装
- [ ] ローディング状態の管理

## 成功基準
- すべてのエラー状態で適切なUIが表示される
- ユーザーが混乱しないエラーメッセージ
- エラー発生時の適切な復旧フロー

## 優先度
🟠 **高** - 本番運用に必須`,
    labels: ["enhancement", "error-handling", "ux", "medium-priority"],
  },
  {
    title: "♿ アクセシビリティの強化",
    body: `## 概要
現在のシステムのアクセシビリティ対応は最小限に留まっており、企業サイトとしての基準を満たしていません。

## 必要な作業

### 1. WAI-ARIA属性
- [ ] セマンティックなHTML構造の見直し
- [ ] aria-label, aria-describedby の追加
- [ ] role属性の適切な使用
- [ ] ランドマークロールの実装

### 2. キーボードナビゲーション
- [ ] Tab順序の最適化
- [ ] フォーカス表示の改善
- [ ] Escキーでのモーダル閉じる機能
- [ ] Enter/Spaceキーでのボタン操作

### 3. スクリーンリーダー対応
- [ ] alt属性の最適化
- [ ] 適切な見出し構造 (h1-h6)
- [ ] コンテンツの読み上げ順序最適化

### 4. 色彩・コントラスト
- [ ] WCAG 2.1 AA準拠のコントラスト比
- [ ] 色だけに依存しない情報伝達
- [ ] ダークモード対応の改善

## 成功基準
- WCAG 2.1 AA準拠
- axe-core テストツールでエラーなし
- スクリーンリーダーでの操作確認完了

## 優先度
🟡 **中** - 企業での評価点となる項目`,
    labels: ["enhancement", "accessibility", "a11y", "medium-priority"],
  },
  {
    title: "📈 パフォーマンス最適化",
    body: `## 概要
現在の画像処理やレンダリングパフォーマンスに改善の余地があります。

## 必要な作業

### 1. 画像最適化
- [ ] WebP形式への対応
- [ ] 画像圧縮アルゴリズムの実装
- [ ] レスポンシブ画像の自動生成
- [ ] 外部ストレージ (Cloudinary等) への移行検討

### 2. コードスプリッティング
- [ ] Dynamic Import の活用
- [ ] ページ単位での最適化
- [ ] コンポーネントの遅延読み込み

### 3. Core Web Vitals最適化
- [ ] LCP (Largest Contentful Paint) 改善
- [ ] CLS (Cumulative Layout Shift) 防止
- [ ] FID (First Input Delay) 最適化
- [ ] Web Vitals監視機能の実装

### 4. キャッシュ戦略
- [ ] Service Worker の実装
- [ ] ブラウザキャッシュの最適化
- [ ] CDNの活用検討

## 成功基準
- Lighthouse Performance スコア90点以上
- Core Web Vitals すべて緑
- 画像読み込み時間50%削減

## 優先度
🟡 **中** - ユーザー体験向上のため`,
    labels: ["enhancement", "performance", "optimization", "medium-priority"],
  },
  {
    title: "🔐 セキュリティ強化",
    body: `## 概要
現在の認証・セキュリティ対策は基本的な実装に留まっており、本番運用には強化が必要です。

## 必要な作業

### 1. CSRF対策
- [ ] CSRFトークンの実装
- [ ] SameSite Cookie の設定
- [ ] Origin/Refererヘッダー検証

### 2. レート制限
- [ ] API呼び出し制限の実装
- [ ] ブルートフォース攻撃対策
- [ ] DDoS軽減策

### 3. 入力値検証強化
- [ ] Zodスキーマの拡充
- [ ] SQLインジェクション対策
- [ ] XSS対策の強化

### 4. Content Security Policy
- [ ] CSPヘッダーの設定
- [ ] inline scriptの削除
- [ ] 外部リソース読み込み制限

### 5. セキュリティヘッダー
- [ ] HSTS の設定
- [ ] X-Frame-Options の設定
- [ ] X-Content-Type-Options の設定

## 成功基準
- セキュリティスキャンでクリティカル問題なし
- OWASP Top 10 への対応完了
- セキュリティヘッダーの適切な設定

## 優先度
🟠 **高** - 本番運用に必須`,
    labels: ["enhancement", "security", "high-priority"],
  },
];

async function createIssues() {
  try {
    console.log("📝 GitHubリポジトリにissueを作成中...\n");
    
    for (const issueData of issues) {
      const response = await octokit.rest.issues.create({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        title: issueData.title,
        body: issueData.body,
        labels: issueData.labels,
      });
      
      console.log(`✅ Issue作成完了: ${issueData.title}`);
      console.log(`   URL: ${response.data.html_url}\n`);
    }
    
    console.log("🎉 すべてのissueの作成が完了しました！");
    console.log("\n📋 作成されたissue一覧:");
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.title}`);
    });
    
  } catch (error) {
    console.error("❌ Issue作成エラー:", error.message);
    if (error.status === 401) {
      console.error("🔑 GitHubトークンの権限を確認してください");
    } else if (error.status === 404) {
      console.error("📁 リポジトリが見つかりません。REPO_OWNERとREPO_NAMEを確認してください");
    }
  }
}

createIssues(); 