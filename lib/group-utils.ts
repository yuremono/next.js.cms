import { Section, GroupStartSection } from "@/types";
import { v4 as uuidv4 } from "uuid";

// グループヘッダー（GroupStartSection）かどうかを判定
export function isGroupHeader(section: Section): section is GroupStartSection {
  return section.layout === "group-start";
}

// セクションがグループに属しているかを判定
export function isGroupChild(section: Section): boolean {
  return !!section.groupId && !isGroupHeader(section);
}

// 指定されたグループの子セクションを取得
export function getGroupChildren(
  sections: Section[],
  groupId: string
): Section[] {
  return sections.filter(
    (section) => section.groupId === groupId && !isGroupHeader(section)
  );
}

// グループセクションを作成
export function createGroupSection(
  name: string = "新しいグループ"
): GroupStartSection {
  return {
    id: uuidv4(),
    layout: "group-start",
    class: "",
    name,
  };
}

// セクションをグループに追加
export function addSectionToGroup(
  sections: Section[],
  sectionIndex: number,
  groupId: string
): Section[] {
  const newSections = [...sections];
  const section = newSections[sectionIndex];

  if (section) {
    newSections[sectionIndex] = {
      ...section,
      groupId,
    };
  }

  return newSections;
}

// セクションをグループから削除
export function removeSectionFromGroup(
  sections: Section[],
  sectionIndex: number
): Section[] {
  const newSections = [...sections];
  const section = newSections[sectionIndex];

  if (section) {
    const { groupId, ...sectionWithoutGroup } = section;
    newSections[sectionIndex] = sectionWithoutGroup;
  }

  return newSections;
}

// グループを削除（子セクションも一緒に削除）
export function deleteGroup(sections: Section[], groupId: string): Section[] {
  return sections.filter(
    (section) =>
      section.groupId !== groupId &&
      !(isGroupHeader(section) && section.id === groupId)
  );
}

// 空のグループを削除
export function deleteEmptyGroups(sections: Section[]): Section[] {
  // 全てのグループIDを取得
  const allGroupIds = sections
    .filter(isGroupHeader)
    .map((section) => section.id);

  // All group IDs: ${allGroupIds.join(', ')}

  // 空のグループIDを特定
  const emptyGroupIds = allGroupIds.filter((groupId) => {
    const children = getGroupChildren(sections, groupId);
    // Group ${groupId} has ${children.length} children
    return children.length === 0;
  });

  // Empty group IDs to delete: ${emptyGroupIds.join(', ')}

  // 空のグループとそのヘッダーを削除
  const result = sections.filter((section) => {
    const shouldDelete = emptyGroupIds.some((emptyGroupId) => {
      return (
        (isGroupHeader(section) && section.id === emptyGroupId) ||
        section.groupId === emptyGroupId
      );
    });
    return !shouldDelete;
  });

  // Sections after empty group deletion: ${result.length}
  return result;
}

// グループ化されたセクション構造
export interface GroupedSection {
  type: "single" | "group";
  section: Section;
  children?: Section[];
}

// セクションをグループ構造に変換
export function groupSections(sections: Section[]): GroupedSection[] {
  const result: GroupedSection[] = [];
  const processedIds = new Set<string>();

  for (const section of sections) {
    if (processedIds.has(section.id)) continue;

    if (isGroupHeader(section)) {
      // グループヘッダーの場合
      const children = getGroupChildren(sections, section.id);
      result.push({
        type: "group",
        section,
        children,
      });

      // 子セクションを処理済みとしてマーク
      children.forEach((child) => processedIds.add(child.id));
      processedIds.add(section.id);
    } else if (!isGroupChild(section)) {
      // グループに属していない通常のセクション
      result.push({
        type: "single",
        section,
      });
      processedIds.add(section.id);
    }
    // グループの子セクションは親グループで処理されるのでスキップ
  }

  return result;
}
