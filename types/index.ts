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
}

export interface MainVisualSection extends BaseSection {
  layout: "mainVisual";
  image?: string;
  imageClass?: string;
  imageAspectRatio?: string; // 画像比率 (例: "4/3", "16/9")
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

export type Section =
	| MainVisualSection
	| ImgTextSection
	| CardsSection
	| FormSection;

export interface Page {
	header: Header;
	footer: Footer;
	sections: Section[];
	customCSS?: string;
}

export function isSection(obj: any): obj is Section {
	return (
		obj &&
		typeof obj === "object" &&
		typeof obj.layout === "string" &&
		typeof obj.class === "string" &&
		(obj.layout === "mainVisual" ||
			obj.layout === "imgText" ||
			obj.layout === "cards" ||
			obj.layout === "form")
	);
}
