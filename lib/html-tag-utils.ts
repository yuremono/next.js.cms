/**
 * HTMLコンテンツを解析してセマンティックタグの自動選択を行うユーティリティ
 */

/**
 * HTMLコンテンツから見出しタグ（H1-H6）を検出
 * @param html 解析するHTMLコンテンツ
 * @returns 見出しタグが含まれている場合true
 */
export function hasHeadingTags(html: string): boolean {
  if (!html || html.trim() === '') return false;
  return /<h[1-6][^>]*>/i.test(html);
}

/**
 * HTMLコンテンツからセマンティックタグを検出
 * @param html 解析するHTMLコンテンツ
 * @returns セマンティックタグが含まれている場合true
 */
export function hasSemanticTags(html: string): boolean {
  if (!html || html.trim() === '') return false;
  return /<(article|nav|aside|main|header|footer)[^>]*>/i.test(html);
}

/**
 * HTMLコンテンツを解析してセクションタグかdivタグかを自動判定
 * @param html 解析するHTMLコンテンツ
 * @returns 'section' または 'div'
 */
export function analyzeHtmlTagType(html: string): 'section' | 'div' {
  if (!html || html.trim() === '') return 'div';
  
  // 見出しタグ（H1-H6）の検出
  const hasHeading = hasHeadingTags(html);
  
  // セマンティックタグの検出
  const hasSemanticContent = hasSemanticTags(html);
  
  // 見出しまたはセマンティックコンテンツがあれば section
  return (hasHeading || hasSemanticContent) ? 'section' : 'div';
}

/**
 * 複数のHTMLコンテンツを結合して解析
 * @param htmlContents HTMLコンテンツの配列
 * @returns 'section' または 'div'
 */
export function analyzeMultipleHtmlContents(htmlContents: (string | undefined)[]): 'section' | 'div' {
  const combinedHtml = htmlContents
    .filter(html => html && html.trim())
    .join('\n');
  
  return analyzeHtmlTagType(combinedHtml);
}

/**
 * セクションの見出しの有無を判定（DescList専用）
 * @param section セクションデータ
 * @returns 見出しがある場合true
 */
export function hasDescListHeading(section: any): boolean {
  // DescListのtitleがある場合、必ずH2タグが出力される
  return !!(section.title && section.title.trim());
}

/**
 * セクションデータから関連するHTMLコンテンツを抽出
 * @param section セクションデータ
 * @returns 解析対象のHTMLコンテンツ配列
 */
export function extractHtmlContents(section: any): (string | undefined)[] {
  const contents: (string | undefined)[] = [];
  
  // DescListセクションの特別処理
  if (section.layout === 'descList') {
    // titleがあれば見出しあり（H2が確実に出力される）
    if (hasDescListHeading(section)) {
      contents.push('<h2>heading detected</h2>'); // 見出しありの印
    }
    // htmlも解析対象に含める
    if (section.html) {
      contents.push(section.html);
    }
    return contents;
  }
  
  // 基本HTML
  if (section.html) {
    contents.push(section.html);
  }
  
  // cardsセクションの各カードHTML
  if (section.cards && Array.isArray(section.cards)) {
    section.cards.forEach((card: any) => {
      if (card.html) {
        contents.push(card.html);
      }
    });
  }
  
  return contents;
}

/**
 * セクションの最終的なタグタイプを決定
 * @param section セクションデータ
 * @param groupContent グループコンテンツ（グループセクションの場合）
 * @param isInsideGroup グループ内のセクションかどうか
 * @returns 'section' または 'div'
 */
export function resolveTagType(
  section: { tagType?: 'auto' | 'section' | 'div'; [key: string]: any },
  groupContent?: string,
  isInsideGroup?: boolean
): 'section' | 'div' {
  // 明示的に指定されている場合はそれを使用
  if (section.tagType === 'section') return 'section';
  if (section.tagType === 'div') return 'div';
  
  // グループ内のセクションは常にdiv（セマンティック階層のため）
  if (isInsideGroup) {
    return 'div';
  }
  
  // auto または未設定の場合は自動判定
  if (groupContent) {
    // グループコンテンツが指定されている場合（グループレベル判定）
    return analyzeHtmlTagType(groupContent);
  } else {
    // 通常のセクション
    const htmlContents = extractHtmlContents(section);
    return analyzeMultipleHtmlContents(htmlContents);
  }
}