# CMSエディタ画面 編集用マッピング

## プレビューモード
```
app/editor/page.tsx (EditorPage)
├─ ヘッダー
│   ├─ /editor タイトル
│   ├─ ダークモード切替
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
    │   └─ components/ui/simple-html-editor.tsx
    ├─ components/sections/FooterEditor.tsx
    │   └─ components/ui/simple-html-editor.tsx
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
        │   ├─ components/ui/editor.tsx (RichTextEditor)
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