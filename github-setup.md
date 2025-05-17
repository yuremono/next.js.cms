# GitHub連携セットアップ手順

## 1. 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の環境変数を設定してください：

```
# GitHub API設定
GITHUB_ACCESS_TOKEN=your_github_access_token_here
GITHUB_REPO_OWNER=your_github_username_or_organization
GITHUB_REPO_NAME=your_repository_name
GITHUB_BRANCH=main # またはデフォルトブランチ名
```

## 2. GitHub Personal Access Tokenの取得方法

1. GitHubにログイン
2. 右上のプロフィールアイコンをクリック
3. 「Settings」を選択
4. 左サイドバーから「Developer settings」を選択
5. 「Personal access tokens」→「Tokens (classic)」を選択
6. 「Generate new token」→「Generate new token (classic)」をクリック
7. トークンに名前を付け（例：CMS Integration）、必要な権限を選択
   - repo（すべてのrepoアクセス）
   - workflow（GitHub Actionsでワークフローを使う場合）
8. 「Generate token」をクリックして保存
9. 生成されたトークンを `.env.local` の `GITHUB_ACCESS_TOKEN` に設定

**重要**: このトークンは一度しか表示されないので、安全な場所に保存してください。 