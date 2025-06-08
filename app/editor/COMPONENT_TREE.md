# CMSエディタ画面 詳細コンポーネントマッピング

このドキュメントは、トップページ表示・編集画面・実際のファイルの対応関係を詳細にマッピングします。

---

## 🎯 トップページ表示の構造とファイル対応

### トップページ全体構造
```
app/page.tsx (HomePage)
├─ CustomCSSLoader (components/CustomCSSLoader.tsx)
│    └─ 💡 トップページ専用CSSファイル読み込み
└─ PageRenderer (components/PageRenderer.tsx) ⭐ **メインレンダリング**
     ├─ header
     ├─ main > sections (各セクション)
     └─ footer
```

### 各セクションの詳細対応

#### 1. HeaderとFooter
```html
<!-- トップページHTML出力 -->
<header class="header">
  <div class="container mx-auto px-4 py-4 flex justify-between items-center">
    ...ヘッダーコンテンツ...
  </div>
</header>
```
- **HTML生成**: `components/PageRenderer.tsx` L215-217
- **デフォルトデータ**: `app/page.tsx` L10-23 (DEFAULT_PAGE_DATA.header.html)
- **編集画面**: `components/sections/HeaderEditor.tsx`
- **編集方法**: SimpleHtmlEditor (compact=true)

#### 2. MainVisualセクション
```html
<!-- トップページHTML出力 -->
<section class="MainVisual">
  <div class="container mx-auto px-4 py-12"> ⭐ **py-12はここ**
    <div class="relative h-[500px] w-full firstImg">
      <img alt="Main Visual" ... />
    </div>
    <div class="content ">
      <h3>コンテンツHTML</h3>
    </div>
  </div>
</section>
```
- **HTML生成**: `components/PageRenderer.tsx` L21-44
  - L23: `className="MainVisual ${sectionClass}"` (sectionClass = section.class)
  - L27: `className="container mx-auto px-4 py-12"` ⭐ **py-12編集箇所**
  - L30: `className="relative h-[500px] w-full ${section.imageClass}"`
  - L39: `className="content ${section.textClass}"`
- **デフォルトデータ**: `app/page.tsx` L57-63
- **編集画面**: `components/sections/MainVisualEditor.tsx`
- **編集項目**:
  - セクションクラス → section.class
  - 画像URL → section.image  
  - 画像クラス → section.imageClass
  - テキストクラス → section.textClass
  - HTMLコンテンツ → section.html

#### 3. ImgTextセクション
```html
<!-- トップページHTML出力 -->
<section class="img-text ImgText">
  <div class="container mx-auto px-4 py-12"> ⭐ **py-12はここ**
    <div class="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      ...画像とテキスト...
    </div>
  </div>
</section>
```
- **HTML生成**: `components/PageRenderer.tsx` L45-75
  - L48: `className="img-text ${sectionClass}"`
  - L52: `className="container mx-auto px-4 py-12"` ⭐ **py-12編集箇所**
- **デフォルトデータ**: `app/page.tsx` L64-69
- **編集画面**: `components/sections/ImgTextEditor.tsx`

#### 4. Cardsセクション
```html
<!-- トップページHTML出力 -->
<section class="cards Cards">
  <div class="container mx-auto px-4 py-12"> ⭐ **py-12はここ**
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      ...カード群...
    </div>
  </div>
</section>
```
- **HTML生成**: `components/PageRenderer.tsx` L76-108
  - L79: `className="cards ${sectionClass}"`
  - L83: `className="container mx-auto px-4 py-12"` ⭐ **py-12編集箇所**
- **デフォルトデータ**: `app/page.tsx` L70-85
- **編集画面**: `components/sections/CardsEditor.tsx`

#### 5. Formセクション
```html
<!-- トップページHTML出力 -->
<section class="form Form">
  <div class="container mx-auto px-4 py-12"> ⭐ **py-12はここ**
    <div class="content mb-8">...HTMLコンテンツ...</div>
    <form class="mx-auto max-w-2xl">...フォーム...</form>
  </div>
</section>
```
- **HTML生成**: `components/PageRenderer.tsx` L109-161
  - L112: `className="form ${sectionClass}"`
  - L116: `className="container mx-auto px-4 py-12"` ⭐ **py-12編集箇所**
- **デフォルトデータ**: `app/page.tsx` L86-91
- **編集画面**: `components/sections/FormEditor.tsx`

---

## 🎯 編集画面の詳細構造

### 編集画面全体
```
app/editor/page.tsx (EditorPage)
├─ ヘッダーバー
│    ├─ サイト名 (直接JSX)
│    ├─ 保存ボタン (L75-79)
│    └─ プレビューリンク (L80-85)
├─ サイドバータブ (L87-140)
│    └─ components/ui/tabs.tsx
│        ├─ TabsList (L88-100)
│        │    ├─ "ヘッダー" TabsTrigger (L89)
│        │    ├─ "フッター" TabsTrigger (L90)  
│        │    ├─ "CSS" TabsTrigger (L91)
│        │    ├─ "AI" TabsTrigger (L92)
│        │    ├─ "画像" TabsTrigger (L93)
│        │    └─ "バックアップ" TabsTrigger (L94)
│        └─ TabsContent (L102-140)
├─ セクションリスト (L142-167)
│    └─ components/SortableSections.tsx
│        ├─ セクション追加ボタン (L149-154)
│        ├─ セクション一覧 (ドラッグ&ドロップ対応)
│        └─ セクション削除機能
└─ 編集エリア (L169-205)
     ├─ タブコンテンツ表示エリア
     └─ セクション編集エリア
```

### タブ別詳細対応

#### 1. ヘッダータブ
- **表示条件**: `activeTab === "header"`
- **コンポーネント**: `components/sections/HeaderEditor.tsx`
- **編集対象**: `pageData.header.html`
- **保存処理**: `updatePageData()`

#### 2. フッタータブ  
- **表示条件**: `activeTab === "footer"`
- **コンポーネント**: `components/sections/FooterEditor.tsx`
- **編集対象**: `pageData.footer.html`

#### 3. CSSタブ
- **表示条件**: `activeTab === "css"`
- **コンポーネント**: `components/editor/CSSEditor.tsx`
- **編集対象**: `pageData.customCSS`
- **特別機能**: `/api/css` API呼び出し、`public/custom.css` 生成

#### 4. AIタブ
- **表示条件**: `activeTab === "ai"`
- **コンポーネント**: `components/sections/TextGenerator.tsx`
- **機能**: OpenAI API連携、テキスト生成

#### 5. 画像タブ
- **表示条件**: `activeTab === "images"`
- **コンポーネント**: `components/images/ImageGallery.tsx`
- **機能**: 画像アップロード、Supabase Storage連携

#### 6. バックアップタブ
- **表示条件**: `activeTab === "backup"`
- **コンポーネント**: `components/github/GitHubPanel.tsx`  
- **機能**: GitHub連携、自動コミット

### セクション編集詳細

#### セクション選択時の表示
```
activeTab === "sections" && selectedSectionId
└─ components/editor/SectionEditorRenderer.tsx
     ├─ セクション削除ボタン (L24-32)
     └─ 動的エディタレンダリング (L34-45)
          ├─ MainVisualEditor (layout === "mainVisual") 
          ├─ ImgTextEditor (layout === "imgText")
          ├─ CardsEditor (layout === "cards")  
          └─ FormEditor (layout === "form")
```

#### 各エディタの編集項目詳細

**MainVisualEditor** (`components/sections/MainVisualEditor.tsx`):
- セクション名 (section.name)
- セクションクラス (section.class) ⭐ **"MainVisual"など**
- 画像URL + 画像クラス (section.image, section.imageClass)
- 背景画像 (section.bgImage)  
- テキストクラス (section.textClass)
- HTMLコンテンツ (section.html) - RichTextEditor

**CardsEditor** (`components/sections/CardsEditor.tsx`):
- セクション名・クラス・背景画像
- カード一覧 (ドラッグ&ドロップ並び替え)
- 各カード編集 (画像・画像クラス・テキストクラス・HTML)

---

## 🎯 よくある編集ケース別対応表

| 編集したい内容 | 編集箇所 | ファイル | 行番号 |
|---|---|---|---|
| **py-12パディング** | PageRenderer各セクション | `components/PageRenderer.tsx` | L27,52,83,116 |
| **section要素のクラス** | 各セクションエディタ | `components/sections/*Editor.tsx` | セクションクラス入力欄 |
| **デフォルトクラス** | DEFAULT_PAGE_DATA | `app/page.tsx` | L57-91 |
| **ヘッダー/フッターHTML** | Header/FooterEditor | `components/sections/Header/FooterEditor.tsx` | SimpleHtmlEditor |
| **画像サイズ・クラス** | PageRenderer固定値 | `components/PageRenderer.tsx` | L30,55,etc |
| **カスタムCSS** | CSSEditor | `components/editor/CSSEditor.tsx` | 専用エディタ |
| **タブ名・スタイル** | 編集画面タブ定義 | `app/editor/page.tsx` | L89-94 |
| **セクション追加ボタン** | SectionSelector | `components/SectionSelector.tsx` | ダイアログ内容 |

---

## 💡 編集フロー例

### ケース1: メインビジュアルの「py-12」を「py-20」に変更
1. `components/PageRenderer.tsx` L27を編集
2. 必要に応じて他セクションも同様に変更 (L52,83,116)

### ケース2: デフォルトセクションクラスを変更  
1. `app/page.tsx` L60 `class: "MainVisual"` を変更
2. または編集画面でセクションクラスを変更してデータベース保存

### ケース3: 新しいセクションタイプを追加
1. `types/index.ts` - 新しいSectionインターフェース追加
2. `components/PageRenderer.tsx` - 新しいcase追加  
3. `components/sections/` - 新しいエディタコンポーネント作成
4. `components/editor/SectionEditorRenderer.tsx` - 新しいエディタ呼び出し追加
5. `components/SectionSelector.tsx` - 選択肢に追加

---

> **🎯 このマッピングにより、「○○を変更したい」→「△△ファイルのX行目」が即座に特定できます。** 