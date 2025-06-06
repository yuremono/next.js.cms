# GitHub連携機能の使い方ガイド

CMSのGitHub連携機能を使うと、ワンクリックでGitHubへの変更をプッシュしたり、イシューやプルリクエストを作成したりすることができます。

## 初期設定

1. まず、`github-setup.md` の手順に従って環境変数を設定してください
2. GitHubのアクセストークンを取得し、`.env.local` ファイルに設定します
3. リポジトリ情報を `.env.local` ファイルに正しく設定します

## 機能の使い方

### GitHub連携タブへのアクセス

CMS管理画面のサイドバーにある「GitHub」タブをクリックすることで、GitHub連携機能にアクセスできます。

### 使える機能

1. **イシュー作成** - 問題点や改善要望をイシューとして記録できます
   - 「イシュー作成」ボタンをクリック
   - タイトルと説明を入力
   - 「作成」をクリック

2. **プルリクエスト作成** - 変更内容を提案するプルリクエストを作成できます
   - 「PR作成」ボタンをクリック
   - タイトル、ブランチ名、説明を入力
   - 「作成」をクリック

3. **ブランチ作成** - 新しい機能開発用のブランチを作成できます
   - 「ブランチ作成」ボタンをクリック
   - ブランチ名とベースブランチを入力
   - 「作成」をクリック

4. **変更をコミット** - ページの変更内容をコミットできます
   - 「変更をコミット」ボタンをクリック
   - コミットメッセージを入力
   - 「コミット」をクリック

### ワークフロー例

#### 新機能の開発

1. 「ブランチ作成」で `feature/new-section` などのブランチを作成
2. CMSで新しいセクションを追加・編集
3. 「変更をコミット」で変更を保存
4. 「PR作成」でプルリクエストを作成し、変更をメインブランチにマージするよう提案

#### 問題の報告

1. 「イシュー作成」をクリック
2. 問題のタイトルと詳細を記入
3. 「作成」をクリック

## GitHub UI 上での操作方法

一部の操作（プルリクエストのマージやレビューなど）は GitHub UI 上で行う必要があります：

1. GitHub リポジトリにアクセス（CMS上の接続情報からリンクをクリックできます）
2. 「Pull requests」タブを選択
3. レビューしたいプルリクエストをクリック
4. 「Files changed」タブで変更内容を確認
5. 「Review changes」ボタンからレビューを送信
6. 「Merge pull request」ボタンで変更をマージ

## トラブルシューティング

### 接続エラーが表示される

- `.env.local` ファイルの設定を確認してください
- GitHub アクセストークンが有効か確認してください
- リポジトリが存在し、アクセス権があるか確認してください

### コミットやプルリクエストが失敗する

- エラーメッセージを確認してください
- GitHub のアクセストークンに十分な権限があるか確認してください
- ブランチ名が正しいか確認してください

## 詳細情報

さらに詳しい情報については [GitHub Developer API](https://docs.github.com/en/rest) のドキュメントを参照してください。 