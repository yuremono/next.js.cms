# 簡易CMS - テンプレートベースのWebサイト編集システム

AIによるテキスト生成機能を備えた、テンプレートベースのWebサイト編集システムです。

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

## デプロイ

[Vercel](https://vercel.com/)を使ったデプロイがおすすめです。

1. GitHubリポジトリにプロジェクトをプッシュ
2. Vercelでプロジェクトを作成し、環境変数を設定
3. デプロイ完了
