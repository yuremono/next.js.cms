# CMSエディタ画面 編集用マッピング

## プレビューモード
```
app/editor/page.tsx (EditorPage)
├─ ヘッダー
│   ├─ /editor タイトル
│   ├─ Toggle dark mode
│   ├─ ページを開くボタン
│   ├─ プレビューボタン
│   ├─ 分割表示ボタン
│   ├─ 保存ボタン
│   └─ ログアウトボタン
├─ タブリスト
│   └─ components/ui/tabs.tsx
│       ├─ Tabs
│       ├─ TabsList
│       └─ TabsTrigger (ヘッダー/フッター/CSS追加/AIで生成/画像一覧/バックアップ)
├─ セクションリスト
│   └─ components/SortableSections.tsx
│       ├─ セクション追加ボタン
│       ├─ SortableItem
│       ├─ GroupEndBar
│       └─ DummyDropTarget
└─ 編集エリア
    ├─ components/sections/HeaderEditor.tsx
    ├─ components/sections/FooterEditor.tsx
    ├─ components/editor/CSSEditor.tsx
    ├─ components/sections/TextGenerator.tsx
    ├─ components/images/ImageGallery.tsx
    ├─ components/backup/DatabaseBackup.tsx
    └─ components/editor/SectionEditorRenderer.tsx
        ├─ components/sections/MainVisualEditor.tsx
        ├─ components/sections/ImgTextEditor.tsx
        ├─ components/sections/CardsEditor.tsx
        ├─ components/sections/FormEditor.tsx
        └─ components/sections/GroupEditor.tsx
```

## 分割プレビューモード
```
app/editor/page.tsx (EditorPage)
├─ ヘッダー (同上)
├─ 左パネル
│   ├─ タブリスト 
│   │   └─ components/ui/tabs.tsx
│   │       ├─ Tabs
│   │       ├─ TabsList
│   │       └─ TabsTrigger
│   ├─ セクションリスト
│   │   └─ components/SortableSections.tsx
│   └─ 編集エリア (同上)
├─ リサイザー
│   └─ GripVertical (lucide-react)
└─ 右パネル: プレビュー
    └─ iframe (src="/preview")
```

## トップページ構造
```
app/page.tsx (Home - Server Component)
├─ import "./top.scss" (トップページ専用スタイル)
├─ DEFAULT_PAGE_DATA (フォールバックデータ)
│   ├─ header.html (デフォルトヘッダー)
│   ├─ footer.html (デフォルトフッター)
│   ├─ sections[] (デフォルトセクション配列)
│   │   ├─ MainVisual セクション
│   │   ├─ ImgText セクション
│   │   ├─ Cards セクション
│   │   └─ Form セクション
│   └─ customCSS (カスタムCSS)
├─ データ取得処理
│   ├─ fetch("/api/page") (APIからページデータ取得)
│   ├─ エラーハンドリング
│   └─ フォールバック処理
└─ レンダリング
    ├─ エラー画面 (データ取得失敗時)
    │   ├─ エラーメッセージ
    │   └─ エディタリンクボタン
    └─ PageRenderer (メインレンダリング)
        └─ components/PageRenderer.tsx
```

## PageRenderer 詳細構造
```
components/PageRenderer.tsx (PageRenderer)
├─ renderSectionsWithGroups() (グループ処理機能)
│   ├─ グループ開始/終了タグ検出
│   ├─ ネストされたセクション処理
│   └─ 通常セクション処理
├─ renderSection() (個別セクションレンダリング)
│   ├─ MainVisual セクション
│   │   ├─ section.class によるCSS制御
│   │   ├─ section.bgImage による背景画像
│   │   ├─ section.image によるメイン画像
│   │   ├─ section.imageClass による画像スタイル
│   │   ├─ section.textClass によるテキストスタイル
│   │   └─ section.html による内容表示
│   ├─ ImgText セクション
│   │   ├─ Grid レイアウト (md:grid-cols-2)
│   │   ├─ 画像部分 (Image コンポーネント)
│   │   │   ├─ aspectRatio 制御
│   │   │   └─ imageClass によるスタイル
│   │   └─ テキスト部分
│   │       ├─ textClass によるスタイル
│   │       └─ dangerouslySetInnerHTML
│   ├─ Cards セクション
│   │   ├─ CardsContainer (CSS Grid)
│   │   └─ 各カード
│   │       ├─ カード画像 (Image コンポーネント)
│   │       │   ├─ aspectRatio 制御
│   │       │   └─ imageClass によるスタイル
│   │       └─ カードコンテンツ
│   │           ├─ textClass によるスタイル
│   │           └─ dangerouslySetInnerHTML
│   ├─ Form セクション
│   │   ├─ section.html によるヘッダー部分
│   │   └─ フォーム要素
│   │       ├─ action (section.endpoint)
│   │       ├─ お名前フィールド
│   │       ├─ メールアドレスフィールド
│   │       ├─ メッセージフィールド
│   │       ├─ プライバシー同意チェックボックス
│   │       └─ 送信ボタン
│   └─ Group セクション (group-start/group-end)
│       ├─ article タグでラップ
│       ├─ グループのclass属性
│       ├─ グループの背景画像
│       ├─ グループのscopeStyles
│       └─ 内包セクションの再帰レンダリング
└─ 最終出力構造
    ├─ header.header (相対位置)
    │   ├─ dangerouslySetInnerHTML (page.header.html)
    │   └─ エディタボタン (showEditorButton=true時)
    │       └─ Link to="/editor"
    ├─ main.min-h-screen
    │   └─ renderSectionsWithGroups() の結果
    └─ footer.footer
        └─ dangerouslySetInnerHTML (page.footer.html)
```

## レイアウト構造
```
app/layout.tsx (RootLayout)
├─ メタデータ設定
│   ├─ title: "簡易CMS - テンプレートベースのWebサイト構築"
│   ├─ description: "AIによるテキスト生成機能..."
│   └─ viewport: "width=device-width, initial-scale=1"
├─ HTML構造
│   ├─ html[lang="ja", suppressHydrationWarning]
│   ├─ head
│   │   └─ link[rel="stylesheet", href="/css/custom.css"]
│   └─ body
│       ├─ {children} (ページコンテンツ)
│       └─ Toaster (通知システム)
│           ├─ position="top-right"
│           └─ style.marginTop="72px"
├─ 開発環境のみ
│   └─ axe-core (アクセシビリティ検証)
└─ スタイル読み込み
    ├─ "./globals.css" (グローバルCSS)
    └─ "/css/custom.css" (カスタムCSS - 動的生成)
```

## トップページ専用スタイル
```
app/top.scss
├─ Tailwind CSS ディレクティブ
│   ├─ @tailwind base
│   ├─ @tailwind components
│   └─ @tailwind utilities
├─ CSS Variables
│   └─ --section-mt: 6rem (セクション間マージン)
├─ メインレイアウト
│   └─ main > * + * { margin-top: var(--section-mt) }
├─ リング色設定
│   └─ --tw-ring-color: hsla(215, 25%, 27%, 0.2)
└─ コンテナ設定
    └─ .container { padding-inline: unset }
```

## 分割プレビュー - タブリスト詳細
```
分割プレビュー
├─ タブリスト (40%以下)
│   └─ components/ui/tabs.tsx
│       ├─ Tabs (className="w-max min-w-full")
│       ├─ TabsList (className="flex min-w-full flex-row items-center gap-1 whitespace-nowrap rounded-none bg-transparent p-0 text-xs")
│       └─ TabsTrigger (className="min-w-[50px] rounded-none border-none bg-transparent p-1 text-left")
└─ タブリスト (通常)
    └─ components/ui/tabs.tsx
        ├─ Tabs (className="w-full")
        ├─ TabsList (className="flex flex-col items-start gap-2 bg-transparent p-0")
        └─ TabsTrigger (className="w-full justify-start rounded-none border-none bg-transparent p-2 text-left")
```

## 分割プレビュー - セクションリスト詳細
```
分割プレビュー
├─ セクションリスト (40%以下)
│   └─ components/SortableSections.tsx
│       ├─ DndContext (@dnd-kit/core)
│       ├─ SortableContext (@dnd-kit/sortable)
│       ├─ SortableItem (useSortable)
│       ├─ GroupEndBar (useSortable disabled)
│       ├─ DummyDropTarget (useSortable)
│       └─ DragOverlay (@dnd-kit/core)
└─ セクションリスト (通常)
    └─ components/SortableSections.tsx (同上)
```

## 分割プレビュー - 編集エリア詳細
```
分割プレビュー
└─ 編集エリア
    ├─ components/sections/HeaderEditor.tsx
    │   └─ components/ui/SimpleHtmlEditor.tsx
    ├─ components/sections/FooterEditor.tsx
    │   └─ components/ui/SimpleHtmlEditor.tsx
    ├─ components/editor/CSSEditor.tsx
    │   └─ components/ui/editor.tsx (RichTextEditor)
    ├─ components/sections/TextGenerator.tsx
    │   ├─ components/ui/button.tsx
    │   ├─ components/ui/textarea.tsx
    │   └─ components/ui/select.tsx
    ├─ components/images/ImageGallery.tsx
    │   ├─ components/images/ImageUpload.tsx
    │   └─ components/images/ImageGalleryModal.tsx
    ├─ components/backup/DatabaseBackup.tsx
    │   ├─ components/ui/button.tsx
    │   └─ components/ui/alert.tsx
    └─ components/editor/SectionEditorRenderer.tsx
        ├─ components/sections/MainVisualEditor.tsx
        │   ├─ components/ui/SimpleHtmlEditor.tsx (改行自動変換対応)
        │   ├─ components/images/ImageUpload.tsx
        │   ├─ components/images/BackgroundImageUpload.tsx
        │   ├─ components/ui/input.tsx
        │   └─ components/ui/card.tsx
        ├─ components/sections/ImgTextEditor.tsx (同様の構成)
        ├─ components/sections/CardsEditor.tsx (同様の構成)
        ├─ components/sections/FormEditor.tsx (同様の構成)
        └─ components/sections/GroupEditor.tsx
            ├─ components/images/BackgroundImageUpload.tsx
            ├─ components/ui/input.tsx
            ├─ components/ui/textarea.tsx
            └─ components/ui/card.tsx
```

## 分割プレビュー - プレビュー詳細
```
分割プレビュー
└─ プレビュー
    ├─ プレビューヘッダー
    │   ├─ プレビュータイトル
    │   └─ ビューポート選択ボタン
    │       ├─ Monitor (lucide-react)
    │       ├─ Tablet (lucide-react)
    │       └─ Smartphone (lucide-react)
    └─ iframe
        └─ app/preview/page.tsx
            └─ components/PageRenderer.tsx
``` 