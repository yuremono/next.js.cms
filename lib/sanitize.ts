import DOMPurify from "dompurify";

// 許可するタグと属性を設定
const config = {
	ALLOWED_TAGS: [
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"p",
		"span",
		"div",
		"br",
		"b",
		"i",
		"u",
		"strong",
		"em",
		"mark",
		"small",
		"del",
		"ins",
		"ul",
		"ol",
		"li",
		"a",
		"img",
		"table",
		"tr",
		"td",
		"th",
		"thead",
		"tbody",
		"nav",
		"header",
		"footer",
		"section",
		"article",
		"aside",
		"main",
	],
	ALLOWED_ATTR: [
		"href",
		"target",
		"src",
		"alt",
		"class",
		"style",
		"width",
		"height",
		"id",
		"name",
		"type",
		"value",
		"placeholder",
		"aria-label",
		"role",
	],
};

/**
 * HTMLをサニタイズして安全なHTMLを返す
 * @param html サニタイズする生のHTML
 * @returns サニタイズされたHTML
 */
export function sanitizeHtml(html: string): string {
	// サーバーサイドでは処理せずにそのまま返す
	if (typeof window === "undefined") {
		return html;
	}

	// クライアントサイドでのみDOMPurifyを使用
	return DOMPurify.sanitize(html, config);
}
