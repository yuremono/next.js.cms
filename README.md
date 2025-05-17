# 簡易CMS - テンプレートベースのWebサイト編集システム

## 概要
このプロジェクトは、テンプレートを用いて簡単に編集できるWebサイトを提供する簡易CMSです。Next.js、TypeScript、TailwindCSS、Supabase、OpenAI APIなどの技術を活用しています。

## セットアップ手順
1. リポジトリをクローン
   ```bash
   git clone https://github.com/yuremono/next.js.cms.git
   cd next.js.cms
   ```
2. 依存パッケージのインストール
   ```bash
   npm install
   ```
3. 環境変数の設定
   `.env.local`ファイルをプロジェクトルートに作成し、以下の内容を設定してください。
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://あなたのプロジェクトID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabaseのAnon Key
   OPENAI_API_KEY=あなたのOpenAI APIキー
   ```
4. 開発サーバーの起動
   ```bash
   npm run dev
   ```
   http://localhost:3000 にアクセスして動作確認できます。

## 機能

- ドラッグ＆ドロップでセクションの追加・入れ替え
- リッチテキストエディタによる編集
- AIによるテキスト生成
- 画像アップロード・管理機能
- モバイルフレンドリーなレスポンシブデザイン

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (ストレージ、データベース)
- OpenAI API (テキスト生成)

## 環境設定

### 1. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com/)でアカウントを作成し、新しいプロジェクトを作成
2. SQLエディタで`supabase_setup.sql`の内容を実行
3. ストレージの設定を確認（`cms-images`バケットが作成されていること）
4. プロジェクトのURLとAnon Keyをコピー

### 2. OpenAI APIキーの取得

1. [OpenAI](https://platform.openai.com/)でアカウントを作成
2. APIキーを生成

### 3. 環境変数の設定

`.env.local`ファイルをプロジェクトルートに作成し、以下の内容を設定:

```
NEXT_PUBLIC_SUPABASE_URL=https://あなたのプロジェクトID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabaseのAnon Key
OPENAI_API_KEY=あなたのOpenAI APIキー
```

## 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

[http://localhost:3000](http://localhost:3000)にアクセスして動作確認できます。

## 使い方

1. トップページ右上の「エディタを開く」をクリック
2. サイドバーからセクションの追加・編集
3. ヘッダーやフッターの編集
4. AIテキスト生成や画像アップロード機能を活用
5. 「保存」ボタンでサイトを更新

## 開発ルール
- コミットメッセージは明確に記述してください。
- 新機能や大きな修正は、`main`ブランチとは別のブランチで作業し、Pull Requestを経由してマージしてください。
- コードレビューを徹底し、品質を維持してください。

## 不明な項目
- デプロイ手順
- テスト方法
- コントリビューションガイドライン

## データベース構造

このプロジェクトでは、Supabaseを使用して以下のデータ構造を管理しています：

### ページテーブル (pages)
- **id**: UUID (プライマリキー)
- **title**: 文字列 (ページのタイトル)
- **slug**: 文字列 (URLスラッグ)
- **created_at**: タイムスタンプ
- **updated_at**: タイムスタンプ
- **content**: JSON (ページの全コンテンツ)
- **meta_description**: 文字列 (SEO用メタ説明)
- **status**: 文字列 (公開状態: draft, published)

### セクションテンプレート (section_templates)
- **id**: UUID (プライマリキー)
- **name**: 文字列 (テンプレート名)
- **category**: 文字列 (カテゴリ)
- **template**: JSON (テンプレートの構造)
- **created_at**: タイムスタンプ

### イメージ (images)
- **id**: UUID (プライマリキー)
- **url**: 文字列 (画像のURL)
- **filename**: 文字列 (ファイル名)
- **size**: 数値 (ファイルサイズ)
- **uploaded_at**: タイムスタンプ

## デプロイ

[Vercel](https://vercel.com/)を使ったデプロイがおすすめです。

1. GitHubリポジトリにプロジェクトをプッシュ
2. Vercelでプロジェクトを作成し、環境変数を設定
3. デプロイ完了

## Vercelデプロイのトラブルシューティング

Vercelでデプロイする際に発生する可能性のある問題と解決策：

### 依存関係の競合エラー

React 19.xと各種ライブラリ（特に@radix-uiコンポーネント、@excalidraw/excalidraw）との互換性問題が発生する場合：

1. `package.json`の`overrides`、`peerDependencies`、`resolutions`セクションでReactとReact DOMのバージョンを18.2.0に固定
2. `.npmrc`ファイルに以下の設定を追加：
   ```
   legacy-peer-deps=true
   engine-strict=false
   save-exact=true
   loglevel=error
   strict-peer-dependencies=false
   fund=false
   audit=false
   force=true
   resolution-mode=highest
   ```

### TypeScriptとESLintエラー

Vercelでのビルド時にTypeScriptやESLintエラーが発生する場合：

1. `next.config.mjs`で以下の設定を有効化：
   ```javascript
   typescript: {
     ignoreBuildErrors: true,
   },
   eslint: {
     ignoreDuringBuilds: true,
   }
   ```

2. `.eslintrc.js`で厳格なルールをオフにする：
   ```javascript
   rules: {
     "@typescript-eslint/no-unused-vars": "off",
     "@typescript-eslint/no-explicit-any": "off",
     "react-hooks/exhaustive-deps": "off",
     "@next/next/no-img-element": "off"
   }
   ```

3. Vercelプロジェクト設定でビルドコマンドをカスタマイズ：
   ```
   NEXT_DISABLE_ESLINT=true NEXT_DISABLE_TYPECHECK=true NODE_OPTIONS='--require ./next-env.js' next build --no-lint --no-mangling
   ```

### 代替デプロイ方法

Vercelでのデプロイに問題が継続する場合、以下の代替方法を検討してください：

1. **Netlify** - 同様のサーバーレスデプロイで設定も類似
2. **GitHub Pages** - 静的エクスポートして利用
3. **Firebase Hosting** - Googleのホスティングサービス
