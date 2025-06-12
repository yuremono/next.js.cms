# 開発者向けドキュメント

## プロジェクト概要

Next.js 14 + TypeScript + Tailwind CSS で構築されたCMSシステム。
認証機能、ページ編集、データベースバックアップ、スプリットスクリーンエディタを搭載。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + CSS Variables
- **データベース**: SQLite (better-sqlite3)
- **認証**: パスワードベース認証
- **UI**: shadcn/ui コンポーネント
- **エディタ**: TipTap (リッチテキストエディタ)
- **ドラッグ&ドロップ**: @dnd-kit

## プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # 認証API
│   │   ├── backup/        # バックアップAPI
│   │   └── page/          # ページデータAPI
│   ├── editor/            # エディタページ
│   ├── preview/           # プレビューページ（iframe用）
│   └── globals.css        # グローバルCSS + CMS設定
├── components/            # Reactコンポーネント
│   ├── auth/             # 認証関連
│   ├── images/           # 画像アップロード
│   ├── sections/         # セクションエディタ
│   ├── ui/               # shadcn/ui コンポーネント
│   └── PageRenderer.tsx  # ページレンダリング
├── lib/                  # ユーティリティ
├── types/                # TypeScript型定義
└── database.db          # SQLiteデータベース
```

## セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. データベース初期化
```bash
npm run db:init
```

### 3. 開発サーバー起動
```bash
npm run dev
```

### 4. 初回アクセス
- http://localhost:3000 でトップページ確認
- http://localhost:3000/editor で編集画面（要認証）

## 主要機能

### 🔐 認証システム
- パスワードベース認証
- セッション管理
- 自動ログアウト

### 📝 ページエディタ
- ヘッダー・フッター・セクション編集
- リッチテキストエディタ
- 画像アップロード（Base64）
- ドラッグ&ドロップ並び替え

### 🎨 セクションタイプ
- **Text**: テキストのみ
- **ImgText**: 画像+テキスト（2カラム）
- **Cards**: カードレイアウト（柔軟なグリッド）
- **Form**: お問い合わせフォーム

### 🖥️ スプリットスクリーンエディタ
- リアルタイムプレビュー
- リサイザブルパネル
- iframe分離によるCSS競合回避
- PostMessage通信

### 💾 データ管理
- SQLiteデータベース
- 自動バックアップ機能
- JSON形式でのデータエクスポート

## CSS設計思想

### Tailwind + CSS Variables ハイブリッド
```css
/* globals.css */
:root {
  --primary: hsl(215, 25%, 27%);  /* Blue-gray */
  --ring: hsl(215, 25%, 35%);     /* Focus ring */
}
```

### Cardsセクションの柔軟レイアウト
```css
.CardsContainer {
  --base: var(--cms-base, 1400px);    /* コンテナ幅 */
  --col: var(--cms-col, 3);           /* カラム数 */
  --gap: var(--cms-gap, 6vmin);       /* レスポンシブgap */
  
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(
    calc(var(--base) / var(--col) - var(--gap)), 1fr
  ));
}
```

## 開発のポイント

### 1. CSS変数による柔軟性
- `--cms-*` 変数でレイアウト制御
- `vmin` 単位でレスポンシブ対応
- メディアクエリ最小限

### 2. TypeScript型安全性
```typescript
// types/index.ts
export interface CardsSection {
  type: 'cards';
  name?: string;
  class: string;
  bgImage?: string;
  cards: Card[];
}
```

### 3. コンポーネント設計
- 単一責任の原則
- Props型定義の徹底
- 再利用可能なUI部品

### 4. データフロー
```
Database → API Routes → Page Components → UI
```

## トラブルシューティング

### よくある問題

**1. データベースエラー**
```bash
# データベース再初期化
rm database.db
npm run db:init
```

**2. 認証が通らない**
- `lib/auth.ts` のパスワード設定確認
- セッションクリア: ブラウザのlocalStorage削除

**3. 画像が表示されない**
- Base64形式で保存されているか確認
- `components/images/ImageUpload.tsx` のエラーログ確認

**4. スプリットスクリーンが動かない**
- `/preview` ページが正常に表示されるか確認
- PostMessage通信のオリジン設定確認

## ブランチ戦略

- `main`: 本番環境
- `split-screen-editor`: スプリットスクリーン機能開発
- `feature/*`: 新機能開発

## パフォーマンス最適化

### 画像最適化
- Next.js Image コンポーネント使用
- aspect-ratio による CLS 防止
- Base64 → 外部ストレージ移行推奨

### CSS最適化
- Tailwind CSS の purge 設定
- CSS変数による動的スタイリング
- Grid/Flexbox による効率的レイアウト

## セキュリティ考慮事項

- XSS対策: `dangerouslySetInnerHTML` の適切な使用
- CSRF対策: API Routes での検証
- 認証: セッション管理の強化

## 今後の拡張予定

- [ ] 外部画像ストレージ対応
- [ ] マルチユーザー対応
- [ ] テーマシステム
- [ ] プラグインアーキテクチャ
- [ ] PWA対応

## 開発環境

- Node.js 18+
- npm 9+
- VSCode + TypeScript拡張推奨
- Cursor AI対応

---

**開発時の注意**: このプロジェクトはCursor AIとの協調開発を前提としています。
コード変更時は型安全性とコンポーネント設計を重視してください。 