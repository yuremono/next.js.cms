# CMSエディタ画面 コンポーネント構成図

このドキュメントは、`app/editor/page.tsx`（CMS編集画面）の各UI領域がどのtsxファイル・コンポーネントに対応しているかをツリー構造で示します。

---

## 画面全体

```
app/editor/page.tsx (EditorPage)
├─ ヘッダー（画面上部バー）
│    └─ 直接JSXで記述
├─ サイドバー（メニュータブ: ヘッダー/フッター/CSS/AI/画像/バックアップ）
│    └─ components/ui/tabs.tsx
│        ├─ Tabs
│        ├─ TabsList
│        └─ TabsTrigger（各タブ: "バックアップ"などのテキストはここで指定）
├─ セクションリスト（ページ内セクションの一覧・並び替え）
│    └─ components/SortableSections.tsx
├─ 編集エリア（タブやセクションに応じて動的に切り替え）
│    ├─ HeaderEditor（components/sections/HeaderEditor.tsx）
│    ├─ FooterEditor（components/sections/FooterEditor.tsx）
│    ├─ CSSEditor（components/editor/CSSEditor.tsx）
│    ├─ GitHubPanel（components/github/GitHubPanel.tsx）
│    ├─ TextGenerator（components/sections/TextGenerator.tsx）
│    ├─ ImageGallery（components/images/ImageGallery.tsx）
│    └─ SectionEditorRenderer（components/editor/SectionEditorRenderer.tsx）
│         ├─ MainVisualEditor（components/sections/MainVisualEditor.tsx）
│         ├─ ImgTextEditor（components/sections/ImgTextEditor.tsx）
│         ├─ CardsEditor（components/sections/CardsEditor.tsx）
│         ├─ FormEditor（components/sections/FormEditor.tsx）
│         └─ ...他セクションエディタ
├─ セクション追加ダイアログ
│    └─ components/ui/dialog.tsx
│    └─ SectionSelector（components/SectionSelector.tsx）
```

---

## 各領域の主な役割・props

- **TabsList/TabsTrigger**: サイドバーのタブUI。タブ名や個別のclassNameは`app/editor/page.tsx`で指定。
- **SortableSections**: セクションリストの並び替え・選択UI。
- **SectionEditorRenderer**: 選択中セクションの型に応じて各エディタ（MainVisualEditor等）を動的に表示。
- **各エディタ（MainVisualEditor等）**: セクションごとの詳細編集UI。

---

## 修正箇所特定のポイント

- サイドバーのタブUIやタブボタンのテキスト・className → `app/editor/page.tsx` の `<TabsList>` `<TabsTrigger>`
- タブ全体のデフォルトデザイン → `components/ui/tabs.tsx`
- セクションリストUI → `components/SortableSections.tsx`
- 各セクションの編集UI → `components/sections/` 配下の各Editor

---

> このドキュメントは開発者が修正箇所を素早く特定できるようにするためのものです。 