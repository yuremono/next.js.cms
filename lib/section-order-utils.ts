import { Section } from "@/types";

/**
 * セクション配列から順序文字列を生成
 * @param sections セクション配列
 * @returns "id1,id2,id3" 形式の文字列
 */
export function sectionsToOrderString(sections: Section[]): string {
  return sections.map((section) => section.id).join(",");
}

/**
 * 順序文字列からセクション配列をソート
 * @param sections 元のセクション配列
 * @param orderString "id1,id2,id3" 形式の順序文字列
 * @returns ソートされたセクション配列
 */
export function sortSectionsByOrderString(
  sections: Section[],
  orderString?: string
): Section[] {
  if (!orderString) {
    // 順序文字列がない場合は元の配列を返す
    return sections;
  }

  const orderIds = orderString.split(",");
  const sectionMap = new Map(sections.map((section) => [section.id, section]));
  const sortedSections: Section[] = [];

  // 順序文字列に従って配列を構築
  for (const id of orderIds) {
    const section = sectionMap.get(id);
    if (section) {
      sortedSections.push(section);
      sectionMap.delete(id); // 処理済みのセクションを削除
    }
  }

  // 順序文字列にないセクションがあれば末尾に追加
  for (const section of sectionMap.values()) {
    sortedSections.push(section);
  }

  return sortedSections;
}

/**
 * セクションの移動を順序文字列に反映
 * @param orderString 現在の順序文字列
 * @param fromIndex 移動元インデックス
 * @param toIndex 移動先インデックス
 * @returns 更新された順序文字列
 */
export function moveSectionInOrderString(
  orderString: string,
  fromIndex: number,
  toIndex: number
): string {
  const orderIds = orderString.split(",");
  const [movedId] = orderIds.splice(fromIndex, 1);
  orderIds.splice(toIndex, 0, movedId);
  return orderIds.join(",");
}

/**
 * 新しいセクションを順序文字列に追加
 * @param orderString 現在の順序文字列
 * @param newSectionId 追加するセクションID
 * @param afterIndex 追加位置のインデックス（-1の場合は末尾）
 * @returns 更新された順序文字列
 */
export function addSectionToOrderString(
  orderString: string,
  newSectionId: string,
  afterIndex: number = -1
): string {
  const orderIds = orderString.split(",");

  if (afterIndex === -1) {
    orderIds.push(newSectionId);
  } else {
    orderIds.splice(afterIndex + 1, 0, newSectionId);
  }

  return orderIds.join(",");
}

/**
 * セクションを順序文字列から削除
 * @param orderString 現在の順序文字列
 * @param sectionId 削除するセクションID
 * @returns 更新された順序文字列
 */
export function removeSectionFromOrderString(
  orderString: string,
  sectionId: string
): string {
  const orderIds = orderString.split(",");
  return orderIds.filter((id) => id !== sectionId).join(",");
}
