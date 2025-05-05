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
}

export interface MainVisualSection extends BaseSection {
	layout: "mainVisual";
	image?: string;
	html: string;
}

export interface ImgTextSection extends BaseSection {
	layout: "imgText";
	image?: string;
	html: string;
}

export interface Card {
	image?: string;
	html: string;
}

export interface CardsSection extends BaseSection {
	layout: "cards";
	cards: Card[];
}

export interface FormSection extends BaseSection {
	layout: "form";
	html: string;
	endpoint: string;
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
 