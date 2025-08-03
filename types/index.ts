// 権限レベルの型定義
export type UserRole = "view" | "edit";

export interface AuthUser {
  role: UserRole;
  authenticated: boolean;
}

export interface Header {
  html: string;
}

export interface Footer {
  html: string;
}

export interface BaseSection {
  layout: string;
  class: string;
  bgImage?: string;
  id: string;
  groupId?: string; // 所属グループID（グループ化用）
  sectionWidth?: string; // セクション幅（例: "max-w-6xl", "container"）
  tagType?: "auto" | "section" | "div"; // HTMLタグタイプ（auto=自動判定、デフォルト）
}

export interface MainVisualSection extends BaseSection {
  layout: "mainVisual";
  image?: string;
  imageClass?: string;
  imageAspectRatio?: string; // 画像比率 (例: "4/3", "16/9")
  textClass?: string;
  html: string;
  name?: string;
}

export interface ImgTextSection extends BaseSection {
  layout: "imgText";
  image?: string;
  imageClass?: string;
  imageAspectRatio?: string; // 画像比率 (例: "4/3", "16/9")
  textClass?: string;
  html: string;
  name?: string;
}

export interface Card {
  image?: string;
  imageClass?: string;
  imageAspectRatio?: string; // 画像比率 (例: "4/3", "16/9")
  textClass?: string;
  html: string;
}

export interface CardsSection extends BaseSection {
  layout: "cards";
  cards: Card[];
  name?: string;
}

export interface FormSection extends BaseSection {
  layout: "form";
  html: string;
  endpoint: string;
  name?: string;
  textClass?: string;
}

// Description List セクション
export interface DescListSection extends BaseSection {
  layout: "descList";
  html: string;
  name?: string; // セクション名
  title?: string; // H2タイトル
  dtWidth?: string; // DT幅設定（デフォルト: "20%"）
}

// グループ開始タグ
export interface GroupStartSection extends BaseSection {
  layout: "group-start";
  name: string; // グループ名
  scopeStyles?: string; // CSS変数スタイル（例: "--gap: 2rem; --bg-color: #f0f0f0;"）
}

// グループ終了タグ
export interface GroupEndSection extends BaseSection {
  layout: "group-end";
}

export type Section =
  | MainVisualSection
  | ImgTextSection
  | CardsSection
  | FormSection
  | GroupStartSection
  | GroupEndSection
  | DescListSection;

export interface Page {
  header: Header;
  footer: Footer;
  sections: Section[];
  customCSS?: string;
  sectionsOrder?: string; // "id1,id2,id3" 形式でセクション順序を管理
}

export function isSection(obj: unknown): obj is Section {
  if (!obj || typeof obj !== "object" || obj === null) {
    return false;
  }

  const section = obj as Record<string, unknown>;

  return (
    typeof section.layout === "string" &&
    typeof section.class === "string" &&
    (section.layout === "mainVisual" ||
      section.layout === "imgText" ||
      section.layout === "cards" ||
      section.layout === "form" ||
      section.layout === "group-start" ||
      section.layout === "group-end" ||
      section.layout === "descList")
  );
}
