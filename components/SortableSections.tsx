import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/types";
import {
  Trash2,
  ImageIcon,
  LayoutGrid,
  Mail,
  Copy,
  GripVertical,
  FolderOpen,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";

// ダミーセクション用のコンポーネント
const DummyDropTarget = ({
  dummySection,
  isDragging,
}: {
  dummySection: Section;
  isDragging: boolean;
}) => {
  const { setNodeRef } = useSortable({ id: dummySection.id });

  return (
    <li
      key={dummySection.id}
      style={{
        height: isDragging ? "2.5rem" : "1px",
        opacity: 0,
        pointerEvents: isDragging ? "auto" : "none",
        marginTop: isDragging ? "-3rem" : "0", // ドラッグ時のみ上のアイテムを覆い隠す
        zIndex: isDragging ? 10 : 0,
        position: "relative",
      }}
    >
      <div ref={setNodeRef} style={{ height: "100%", width: "100%" }} />
    </li>
  );
};

interface SortableSectionsProps {
  sections: Section[];
  activeSectionIndex: number | null;
  onSectionClick: (index: number) => void;
  onSectionMove: (fromIndex: number, toIndex: number) => void;
  onSectionDelete: (index: number) => void;
  onSectionsChange?: (sections: Section[]) => void;
  onGroupToggle?: (groupId: string) => void;
  expandedGroups?: Set<string>;
}

// 終了タグ専用のコンポーネント
const GroupEndBar = ({
  section,
  index,
  isActive,
  onSelect,
}: {
  section: Section;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) => {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
    disabled: true, // ドラッグを無効化
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, pointerEvents: "none" }}
      className={`mb-2 h-1 cursor-pointer rounded-full bg-blue-400 transition-colors ${
        isActive ? "bg-blue-600" : "hover:bg-blue-500"
      }`}
      onClick={onSelect}
    />
  );
};

// ドラッグ可能なアイテムのコンポーネント
const SortableItem = ({
  section,
  index,
  isActive,
  onSelect,
  onDelete,
  isChild = false,
  isGroupStart = false,
  isCollapsed = false,
  onToggleCollapse,
  isEmptyGroup = false,
}: {
  section: Section;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isChild?: boolean;
  isGroupStart?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isEmptyGroup?: boolean;
}) => {
  // セクションタイプに応じて表示名を取得
  const getSectionTitle = (section: Section) => {
    // セクション名が設定されている場合はそれを表示
    if ("name" in section && section.name) {
      return section.name;
    }

    // セクション名が未設定の場合はデフォルト名を表示
    switch (section.layout) {
      case "mainVisual":
        return "メインビジュアル";
      case "imgText":
        return "画像テキスト";
      case "cards":
        return "カード";
      case "form":
        return "お問い合わせフォーム";
      case "group-start":
        return `<article> ${section.name || "グループ開始"}`;
      case "group-end":
        return "</article>";
      default:
        return "不明なセクション";
    }
  };

  // セクションタイプに応じたアイコンを取得
  const getSectionIcon = (section: Section) => {
    switch (section.layout) {
      case "mainVisual":
        return <ImageIcon className="mr-1 w-4 flex-shrink-0 text-slate-500" />;
      case "imgText":
        return <Copy className=" mr-1 w-4 flex-shrink-0 text-green-500" />;
      case "cards":
        return (
          <LayoutGrid className="mr-1 w-4 flex-shrink-0 text-yellow-500" />
        );
      case "form":
        return <Mail className=" mr-1 w-4 flex-shrink-0 text-purple-500" />;
      case "group-start":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse?.();
            }}
            className="mr-1 flex h-4 w-4 items-center justify-center rounded hover:bg-gray-100"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3 text-blue-500" />
            ) : (
              <ChevronDown className="h-3 w-3 text-blue-500" />
            )}
          </button>
        );
      case "group-end":
        return <FolderOpen className="mr-1 w-4 flex-shrink-0 text-blue-400" />;

      default:
        return null;
    }
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`rounded-lg p-2 ${
        isActive ? "border-slate-500 " : "hover:border-gray-300"
      } ${isChild ? "ml-8 border-l-2 border-l-blue-300" : ""} mb-2 cursor-pointer transition-colors`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            {...attributes}
            {...listeners}
            className="mr-1 cursor-grab text-gray-400 hover:text-gray-600"
            role="button"
            aria-label={`${getSectionTitle(section)}セクションをドラッグして並び替え`}
            tabIndex={0}
          >
            <GripVertical className="h-4 w-4 flex-shrink-0" />
          </div>
          {getSectionIcon(section)}
          <span className="text-sm">{getSectionTitle(section)}</span>
        </div>
        <div className="flex items-center space-x-1">
          {/* グループ開始タグで空の場合のみ削除ボタンを表示 */}
          {(section.layout !== "group-start" || isEmptyGroup) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (
                  confirm(
                    `「${getSectionTitle(section)}」セクションを削除しますか？`
                  )
                ) {
                  onDelete();
                }
              }}
              className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
              aria-label={`${getSectionTitle(section)}セクションを削除`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default function SortableSections({
  sections,
  activeSectionIndex,
  onSectionClick,
  onSectionMove,
  onSectionDelete,
  onSectionsChange,
  onGroupToggle,
  expandedGroups,
}: SortableSectionsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );

  // ダミーセクションを追加（ドラッグ&ドロップの最後の位置確保用）
  const dummySection: Section = {
    id: "__dummy_end__",
    layout: "mainVisual",
    class: "",
    html: "",
  };

  // ダミーセクションを含む配列を作成
  const sectionsWithDummy = [...sections, dummySection];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sections.findIndex((section) => section.id === active.id);
    let newIndex = sectionsWithDummy.findIndex(
      (section) => section.id === over.id
    );

    // ダミーセクションにドロップした場合は最後の位置に移動
    if (over.id === "__dummy_end__") {
      newIndex = sections.length;
    } else {
      // sectionsWithDummyのインデックスをsectionsのインデックスに変換
      // ダミーセクションは最後にあるので、newIndexがsections.lengthより小さい場合はそのまま
      if (newIndex >= sections.length) {
        newIndex = sections.length;
      }
    }

    if (oldIndex !== -1 && newIndex !== -1) {
      const draggedSection = sections[oldIndex];

      // グループ開始タグの場合は、グループ全体を移動
      if (draggedSection.layout === "group-start") {
        handleGroupMove(oldIndex, newIndex);
      } else {
        onSectionMove(oldIndex, newIndex);
      }
    }
  };

  // グループ全体を移動する関数
  const handleGroupMove = (groupStartIndex: number, targetIndex: number) => {
    // グループの終了タグを探す
    let groupEndIndex = -1;
    for (let i = groupStartIndex + 1; i < sections.length; i++) {
      if (sections[i].layout === "group-end") {
        groupEndIndex = i;
        break;
      }
    }

    if (groupEndIndex === -1) return; // 終了タグが見つからない場合は何もしない

    // グループ全体（開始タグ〜終了タグ）を取得
    const groupSections = sections.slice(groupStartIndex, groupEndIndex + 1);

    // 元のグループを削除
    const newSections = [
      ...sections.slice(0, groupStartIndex),
      ...sections.slice(groupEndIndex + 1),
    ];

    // 新しい挿入位置を計算
    let adjustedTargetIndex = targetIndex;

    // targetIndexが元のグループより後ろの場合、グループサイズ分を調整
    if (targetIndex > groupEndIndex) {
      adjustedTargetIndex = targetIndex - groupSections.length;
    } else if (targetIndex > groupStartIndex) {
      // グループ内への移動の場合は、グループの開始位置に移動
      adjustedTargetIndex = groupStartIndex;
    }

    // 最後に移動する場合の特別処理
    if (adjustedTargetIndex >= newSections.length) {
      adjustedTargetIndex = newSections.length;
    }

    // 新しい位置にグループを挿入
    const finalSections = [
      ...newSections.slice(0, adjustedTargetIndex),
      ...groupSections,
      ...newSections.slice(adjustedTargetIndex),
    ];

    // セクション配列を更新
    if (onSectionsChange) {
      onSectionsChange(finalSections);
    }
  };

  // グループの開閉を切り替える
  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // グループ構造を解析してレンダリング用のアイテムリストを作成
  const renderItems = () => {
    const result = [];
    let i = 0;

    while (i < sections.length) {
      const section = sections[i];
      const sectionIndex = i;
      const isActive = activeSectionIndex === sectionIndex;

      if (section.layout === "group-start") {
        // グループ開始を見つけたら、対応する終了まで探す
        const groupStartSection = section;
        const groupSections = [];
        let groupEndIndex = -1;

        // 対応する終了タグを探す
        for (let j = i + 1; j < sections.length; j++) {
          if (sections[j].layout === "group-end") {
            groupEndIndex = j;
            break;
          } else if (sections[j].layout !== "group-start") {
            // 通常のセクションをグループに追加
            groupSections.push({ section: sections[j], index: j });
          }
        }

        const isCollapsed = collapsedGroups.has(section.id);

        // グループ開始タグを追加
        result.push(
          <li key={section.id}>
            <SortableItem
              section={section}
              index={sectionIndex}
              isActive={isActive}
              onSelect={() => onSectionClick(sectionIndex)}
              onDelete={() => onSectionDelete(sectionIndex)}
              isChild={false}
              isGroupStart={true}
              isCollapsed={isCollapsed}
              onToggleCollapse={() => toggleGroupCollapse(section.id)}
              isEmptyGroup={groupSections.length === 0}
            />
          </li>
        );

        // 折りたたまれていない場合のみ、グループ内セクションを表示
        if (!isCollapsed) {
          groupSections.forEach(
            ({ section: groupSection, index: groupIndex }) => {
              const isGroupSectionActive = activeSectionIndex === groupIndex;
              result.push(
                <li key={groupSection.id}>
                  <SortableItem
                    section={groupSection}
                    index={groupIndex}
                    isActive={isGroupSectionActive}
                    onSelect={() => onSectionClick(groupIndex)}
                    onDelete={() => onSectionDelete(groupIndex)}
                    isChild={true}
                    isGroupStart={false}
                    isCollapsed={false}
                    onToggleCollapse={() => {}}
                    isEmptyGroup={false}
                  />
                </li>
              );
            }
          );
        }

        // グループ終了タグを追加（折りたたまれていない場合のみ）
        if (groupEndIndex !== -1 && !isCollapsed) {
          const endSection = sections[groupEndIndex];
          const isEndActive = activeSectionIndex === groupEndIndex;
          result.push(
            <li key={endSection.id}>
              <GroupEndBar
                section={endSection}
                index={groupEndIndex}
                isActive={isEndActive}
                onSelect={() => onSectionClick(groupEndIndex)}
              />
            </li>
          );
        }

        // グループ全体をスキップ
        i = groupEndIndex !== -1 ? groupEndIndex + 1 : i + 1;
      } else if (section.layout === "group-end") {
        // 対応する開始タグがない終了タグ（通常は上で処理されるのでここには来ない）
        result.push(
          <li key={section.id}>
            <SortableItem
              section={section}
              index={sectionIndex}
              isActive={isActive}
              onSelect={() => onSectionClick(sectionIndex)}
              onDelete={() => onSectionDelete(sectionIndex)}
              isChild={false}
              isGroupStart={false}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              isEmptyGroup={false}
            />
          </li>
        );
        i++;
      } else {
        // 通常のセクション
        result.push(
          <li key={section.id}>
            <SortableItem
              section={section}
              index={sectionIndex}
              isActive={isActive}
              onSelect={() => onSectionClick(sectionIndex)}
              onDelete={() => onSectionDelete(sectionIndex)}
              isChild={false}
              isGroupStart={false}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              isEmptyGroup={false}
            />
          </li>
        );
        i++;
      }
    }

    return result;
  };

  // ドラッグ中のセクションを取得
  const draggedSection = activeId
    ? sections.find((section) => section.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sectionsWithDummy.map((section) => section.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul role="list" aria-label="セクション一覧">
          {renderItems()}

          {/* ダミーセクション（拡大されたドロップターゲット） */}
          <DummyDropTarget
            dummySection={dummySection}
            isDragging={!!activeId}
          />

          {sections.length === 0 && (
            <li>
              <div className="rounded-md border border-dashed p-6 text-center">
                <p className="text-muted-foreground">
                  セクションがありません。「セクション追加」ボタンから新しいセクションを追加してください。
                </p>
              </div>
            </li>
          )}
        </ul>
      </SortableContext>

      {/* ドラッグオーバーレイ */}
      <DragOverlay>
        {activeId && draggedSection ? (
          <div className="rotate-3 scale-105 opacity-95 shadow-2xl">
            <SortableItem
              section={draggedSection}
              index={sections.findIndex((s) => s.id === draggedSection.id)}
              isActive={false}
              onSelect={() => {}}
              onDelete={() => {}}
              isChild={false}
              isGroupStart={draggedSection.layout === "group-start"}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              isEmptyGroup={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
