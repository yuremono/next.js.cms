# 🚀 新セクション追加チェックリスト

## 📌 基本姿勢
**「セクション追加」のキーワードで必ずこのチェックリストを確認する**

新しいセクションタイプを追加する際は、以下の全項目を**順番通り**に実装・確認してください。一つでも漏れると、移動・保存・表示で問題が発生します。

---

## 🎯 **1. 型定義（types/index.ts）**

### ✅ 必須項目
- [ ] **BaseSection を継承したインターフェース定義**
- [ ] **layout プロパティの設定** (例: `layout: "newSection"`)
- [ ] **Section 型のユニオンに追加**
- [ ] **isSection 関数に条件追加**

### ⚠️ 見落としがちなポイント
- **layout名は必ずcamelCase**（例: `descList`, `imgText`）
- **プロパティ名はcamelCase**（例: `dtWidth`, `imageClass`）

```typescript
// 例: 新しいセクション型
export interface NewSectionType extends BaseSection {
  layout: "newSection";
  html: string;
  name?: string;
  customProperty?: string;
}

// Section型に追加
export type Section = 
  | MainVisualSection
  | ImgTextSection
  | CardsSection
  | FormSection
  | GroupStartSection
  | GroupEndSection
  | DescListSection
  | NewSectionType; // ← 追加

// isSection関数に追加
export function isSection(obj: unknown): obj is Section {
  // ... 既存のコード ...
  return (
    typeof section.layout === "string" &&
    typeof section.class === "string" &&
    (section.layout === "mainVisual" ||
      section.layout === "imgText" ||
      section.layout === "cards" ||
      section.layout === "form" ||
      section.layout === "group-start" ||
      section.layout === "group-end" ||
      section.layout === "descList" ||
      section.layout === "newSection") // ← 追加
  );
}
```

---

## 🎯 **2. データベース設計（SQL）**

### ✅ 必須項目
- [ ] **sectionsテーブルのtype制約更新**
- [ ] **専用テーブル作成**（例: `new_section_sections`）
- [ ] **外部キー制約設定**
- [ ] **インデックス追加**
- [ ] **RLSポリシー設定**

### ⚠️ 見落としがちなポイント
- **type制約のALTER文を忘れがち**
- **section_idカラムにUNIQUE制約が必要**（upsert用）

```sql
-- 1. sectionsテーブルのtype制約更新
ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_type_check;
ALTER TABLE sections ADD CONSTRAINT sections_type_check 
CHECK (type IN ('mainVisual', 'imgText', 'cards', 'form', 'group-start', 'group-end', 'descList', 'newSection'));

-- 2. 専用テーブル作成
CREATE TABLE IF NOT EXISTS new_section_sections (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL UNIQUE REFERENCES sections(id) ON DELETE CASCADE,
  class TEXT NOT NULL DEFAULT '',
  bg_image TEXT,
  name TEXT,
  html TEXT,
  custom_property TEXT,
  section_width TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. インデックス追加
CREATE INDEX IF NOT EXISTS idx_new_section_sections_section_id ON new_section_sections(section_id);

-- 4. RLSポリシー（必要に応じて）
```

---

## 🎯 **3. API Route対応（app/api/page/route.ts）**

### ✅ 必須項目
- [ ] **GET処理: データ取得ロジック追加**
- [ ] **POST処理: 更新用upsertロジック追加**
- [ ] **POST処理: 新規挿入ロジック追加**
- [ ] **onConflict指定** (`onConflict: "section_id"`)

### ⚠️ 見落としがちなポイント
- **GET、POST両方に追加が必要**
- **upsertでonConflictを必ず指定**（今回の問題の原因）
- **デバッグログの追加**

```typescript
// GET処理（データ取得）
} else if (section.type === "newSection") {
  const { data: ns } = await supabase
    .from("new_section_sections")
    .select("*")
    .eq("section_id", section.id)
    .single();
  sectionResults.push({
    id: `section-${section.id}`,
    layout: "newSection",
    class: ns?.class ?? "",
    bgImage: ns?.bg_image ?? "",
    name: ns?.name ?? "",
    html: ns?.html ?? "",
    customProperty: ns?.custom_property ?? "",
    sectionWidth: ns?.section_width ?? "",
  });
}

// POST処理（更新）
} else if (section.layout === "newSection") {
  console.log("🔍 NEWSECTION UPSERT:", {
    section_id: section.id,
    name: section.name,
    // ... 他のプロパティ
  });
  const newSectionPromise = supabase.from("new_section_sections").upsert(
    {
      section_id: section.id,
      class: section.class,
      bg_image: section.bgImage,
      name: section.name,
      html: section.html,
      custom_property: section.customProperty,
      section_width: section.sectionWidth ?? null,
    },
    {
      onConflict: "section_id", // ← 必須！
    }
  );
  updateDetailPromises.push(newSectionPromise);
}

// POST処理（新規挿入）
} else if (section.layout === "newSection") {
  insertDetailPromises.push(
    supabase.from("new_section_sections").insert({
      section_id: sectionId,
      class: section.class,
      bg_image: section.bgImage,
      name: section.name,
      html: section.html,
      custom_property: section.customProperty,
      section_width: section.sectionWidth ?? null,
    })
  );
}
```

---

## 🧭 並び順（sectionsOrder）に関する注意点（除外・再構成ポリシー）

次のケースでは、並び順の再構成時に「除外」または「特別扱い」されます。新規タイプ追加時はこのポリシーに準拠してください。

- **グループ境界**:
  - `group-start` / `group-end` は「表示用タグ」であり、実セクションコンテンツではないため、複製不可・単独移動により不整合が起きないように制御します。
  - 並び順文字列 `sections_order` には両方が含まれ、再構成でも維持されます。
- **並び順の最終確定**:
  - 保存APIでは、受信した配列順から `sections_order` を再生成しDBへ書き戻します（IDは `section-<numericId>` 形式）。
  - クライアント一時IDとDB数値IDが異なる場合でも、保存時にサーバが正しい順序文字列へ正規化します。
- **例外扱い（除外）**
  - 将来的にドラフト型など保存対象外が登場する場合は `sections_order` に含めない運用を想定。現状は全タイプを含めます。

チェックリスト（新タイプ追加時）:
- [ ] 並び順の生成/更新ロジックに新タイプが参加しているか（例: `sections.map(id)`）
- [ ] `group-start / group-end` と衝突する特性がないか（ネスト構造維持）

---

## 🎯 **4. エディターコンポーネント作成**

### ✅ 必須項目
- [ ] **専用エディターコンポーネント作成**（例: `NewSectionEditor.tsx`）
- [ ] **SectionEditorRendererに追加**
- [ ] **createDefaultSection関数に追加**

### ⚠️ 見落としがちなポイント
- **共通設定項目の実装**（セクション名、クラス、幅、背景画像）
- **onUpdate関数の正しい型指定**

```typescript
// components/sections/NewSectionEditor.tsx
interface NewSectionEditorProps {
  section: NewSectionType;
  onUpdate: (section: NewSectionType) => void;
}

export function NewSectionEditor({ section, onUpdate }: NewSectionEditorProps) {
  // 実装...
}

// SectionEditorRenderer.tsx
case "newSection":
  return (
    <NewSectionEditor section={section} onUpdate={onUpdate} />
  );

// createDefaultSection関数
case "newSection":
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    layout: "newSection",
    class: "NewSection",
    name: "新セクション",
    html: "<p>初期コンテンツ</p>",
  };
```

---

## 🎯 **5. PageRenderer対応**

### ✅ 必須項目
- [ ] **renderSection関数にcase追加**
- [ ] **適切なHTML構造で出力**

```typescript
case "newSection":
  return (
    <section
      key={index}
      className={`NewSection ${sectionClass}`}
      style={combinedStyle}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: section.html,
        }}
      />
    </section>
  );
```

---

## 🎯 **6. UI統合（セクション一覧・セレクター）**

### ✅ 必須項目
- [ ] **SortableSections.tsx: getSectionTitle関数に追加**
- [ ] **SortableSections.tsx: getSectionIcon関数に追加**
- [ ] **IDEStyleSectionList.tsx: getSectionTitle関数に追加**
- [ ] **IDEStyleSectionList.tsx: getSectionIcon関数に追加**
- [ ] **SectionSelector.tsx: セクション選択肢に追加**

### ⚠️ 見落としがちなポイント
- **4つのファイル全てに追加が必要**
- **アイコンの統一性**

```typescript
// getSectionTitle関数
case "newSection":
  return "新セクション";

// getSectionIcon関数
case "newSection":
  return <NewIcon className="mr-1 w-4 flex-shrink-0 text-blue-500" />;

// SectionSelector.tsx
{
  label: "新セクション",
  type: "newSection",
  icon: <NewIcon className="h-5 w-5" />,
  description: "新しいセクションタイプ",
},
```

---

## 🎯 **7. CSS設計**





---

## 🎯 **8. デバッグ対応**

### ✅ 必須項目
- [ ] **デバッグAPI Routeに追加**
- [ ] **適切なデバッグログ追加**

```typescript
// app/api/debug/sections/route.ts
} else if (section.type === "newSection") {
  const { data: nsData } = await supabase
    .from("new_section_sections")
    .select("name")
    .eq("section_id", section.id)
    .single();
  sectionName = nsData?.name || "無名NewSection";
}
```

---

## 🎯 **9. 最終確認テスト**

### ✅ 必須テスト項目
- [ ] **セクション追加**
- [ ] **セクション編集**
- [ ] **セクション移動**（ドラッグ&ドロップ + キーボード）
- [ ] **セクション削除**
- [ ] **保存・読み込み**
- [ ] **プレビュー表示**
- [ ] **レスポンシブ確認**

### ⚠️ 特に重要な確認ポイント
- **移動後の保存で順序が維持されるか**
- **ページリロード後に正しく表示されるか**
- **他のセクションとの競合がないか**

---

## 🚨 **よくある落とし穴**

1. **API RouteのonConflict指定忘れ** → upsertエラー
2. **type制約の更新忘れ** → データベースエラー
3. **4つのUI関数への追加忘れ** → 表示・移動エラー
4. **CSS変数の命名規則違反** → スタイル適用エラー
5. **デバッグログの追加忘れ** → 問題発生時の原因特定困難

---

## 🔒 RLSポリシーの一括設定例（Supabase）

以下は、`sections` 本体＋各詳細テーブル（例として `html_content_sections`）の基本RLS例です。匿名（anon）でも編集できる開発用の緩い設定。本番では適宜Roleを限定してください。

```sql
-- 1回目実行: RLS有効化と基本ポリシー
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY sections_select ON sections FOR SELECT USING (true);
CREATE POLICY sections_insert ON sections FOR INSERT WITH CHECK (true);
CREATE POLICY sections_update ON sections FOR UPDATE USING (true);
CREATE POLICY sections_delete ON sections FOR DELETE USING (true);

ALTER TABLE html_content_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY html_content_select ON html_content_sections FOR SELECT USING (true);
CREATE POLICY html_content_insert ON html_content_sections FOR INSERT WITH CHECK (true);
CREATE POLICY html_content_update ON html_content_sections FOR UPDATE USING (true);
CREATE POLICY html_content_delete ON html_content_sections FOR DELETE USING (true);

-- 他の詳細テーブル(main_visual_sections, img_text_sections, cards_sections, form_sections,
-- group_start_sections, group_end_sections)にも同様に適用する。
```

注意:
- `upsert` を使うテーブルの `onConflict` には UNIQUE 制約が必須（例: `section_id`）
- `sections.type` のチェック制約/enumの更新を忘れない

## 📝 **実装完了の確認**
ユーザーが表示中の開発画面で確認



---

**このチェックリストを必ず順番通りに実行することで、今回のような順序保存問題を防げます！** 