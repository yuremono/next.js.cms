import { Button } from "@/components/ui/button";
import { Section } from "@/types";
import { toast } from "sonner";
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
  FileText,
  SquareCode,
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

interface SortableSectionsProps {
  sections: Section[];
  activeSectionIndex: number | null;
  onSectionClick: (index: number) => void;
  onSectionMove?: (fromIndex: number, toIndex: number) => void;
  onSectionDelete: (index: number) => void;
  onSectionsChange?: (sections: Section[]) => void;
}

export default function SortableSections({
  sections,
  activeSectionIndex,
  onSectionClick,
  onSectionDelete,
  onSectionsChange,
}: SortableSectionsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );

  // グループ色生成関数
  const getGroupColor = (
    groupId: string
  ): { border: string; bgWithAlpha: string; text: string } => {
    // 全てのグループIDを取得して、このグループが何番目かを計算
    const allGroupIds = sections
      .filter((section) => section.layout === "group-start")
      .map((section) => section.id)
      .sort(); // 一貫した順序を保つためソート

    const groupIndex = allGroupIds.indexOf(groupId);

    // --primaryの色相（215度）を基準に、36度ずつ増加
    const baseHue = 215; // --primary の色相
    const hueStep = 36; // 色相の増加量（360度 ÷ 10 = 36度で10色のサイクル）
    const hue = (baseHue + groupIndex * hueStep) % 360;

    // 彩度と明度は既存と同じ値を維持
    const saturation = 45; // 控えめな彩度
    const lightness = 65; // ボーダー用の明度

    return {
      border: `hsl(${hue}, ${saturation}%, ${lightness}%)`, // ボーダー色
      bgWithAlpha: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`, // ボーダー色の30%透明度
      text: `hsl(${hue}, ${saturation}%, ${lightness - 20}%)`, // テキストは少し濃く
    };
  };

  // 終了タグ専用のコンポーネント
  const GroupEndBar = ({
    section,
    isActive,
    groupStartId,
  }: {
    section: Section;
    isActive: boolean;
    groupStartId: string;
  }) => {
    const { setNodeRef, transform, transition, isDragging } = useSortable({
      id: section.id,
      disabled: true, // 終了タグは移動不可
    });

    // 開始タグのIDから色を生成（開始タグと同じ色にする）
    const groupColors = getGroupColor(groupStartId);

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      pointerEvents: "none" as const, // クリックを無効化
    };

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          backgroundColor: groupColors.border,
        }}
        className={`mb-2 h-1 rounded-full transition-colors ${
          isActive ? "opacity-100" : "opacity-70"
        } relative`}
      >
        <span className="absolute -top-1 right-0 text-xs text-gray-500"></span>
      </div>
    );
  };

  // ドラッグ可能なアイテムのコンポーネント
  const SortableItem = ({
    section,
    index: _idx,
    isActive,
    onSelect,
    onDelete,
    isChild = false,
    isGroupStart = false,
    isCollapsed = false,
    onToggleCollapse,
    isEmptyGroup = false,
    groupColors,
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
    groupColors?: {
      border: string;
      bgWithAlpha: string;
      text: string;
    };
  }) => {
    // 明示的に未使用をマーク
    void _idx;
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
        case "descList":
          return "DLリスト";
        case "htmlContent":
          return section.name || "HTMLコンテンツ";
        case "group-start":
          return `<グループ開始> ${section.name || "グループ開始"}`;
        case "group-end":
          return "</グループ終了>";
        default:
          return "不明なセクション";
      }
    };

    // セクションタイプに応じたアイコンを取得
    const getSectionIcon = (section: Section) => {
      switch (section.layout) {
        case "mainVisual":
          return (
            <ImageIcon className="mr-1 w-4 flex-shrink-0 text-slate-500" />
          );
        case "imgText":
          return <Copy className=" mr-1 w-4 flex-shrink-0 text-green-500" />;
        case "cards":
          return (
            <LayoutGrid className="mr-1 w-4 flex-shrink-0 text-yellow-500" />
          );
        case "form":
          return <Mail className=" mr-1 w-4 flex-shrink-0 text-purple-500" />;
        case "descList":
          return <FileText className="mr-1 w-4 flex-shrink-0 text-cyan-500" />;
        case "htmlContent":
          return <SquareCode className="mr-1 w-4 flex-shrink-0 text-slate-600" />;
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
                <ChevronRight className="h-3 w-3 text-current" />
              ) : (
                <ChevronDown className="h-3 w-3 text-current" />
              )}
            </button>
          );
        case "group-end":
          return (
            <FolderOpen className="mr-1 w-4 flex-shrink-0 text-blue-400" />
          );

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
      <div
        ref={setNodeRef}
        style={{
          ...style,
          ...(isGroupStart && groupColors
            ? {
                backgroundColor: groupColors.bgWithAlpha,
              }
            : {}),
          ...(isChild && groupColors
            ? {
                borderLeftColor: groupColors.border,
              }
            : {}),
        }}
        className={`rounded-lg border bg-card p-2 text-card-foreground shadow-sm ${
          isActive ? "border-slate-500" : "hover:border-gray-300"
        } ${isChild ? "ml-4 border-l-2" : ""} mb-2 cursor-pointer transition-colors`}
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
            <span className=" ">{getSectionTitle(section)}</span>
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
                className="h-6 w-6 p-0 text-red-700 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
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
    const newIndex = sections.findIndex((section) => section.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const draggedSection = sections[oldIndex];

      if (draggedSection.layout === "group-start") {
        // ドロップ先がグループ内かチェック
        if (isInsideGroup(newIndex)) {
          toast.error("グループをグループ内に移動することはできません");
          return;
        }
        handleGroupMove(oldIndex, newIndex);
      } else {
        // 通常のセクション移動：個別に順番通り移動
        handleSingleSectionMove(oldIndex, newIndex);
      }
    }
  };

  // 通常セクションの移動処理
  const handleSingleSectionMove = (fromIndex: number, toIndex: number) => {
    const newSections = [...sections];
    const [movedSection] = newSections.splice(fromIndex, 1);

    // 移動先の調整：fromIndexより後ろに移動する場合は、削除により位置が1つ前にずれる
    const adjustedToIndex = fromIndex < toIndex ? toIndex : toIndex;

    newSections.splice(adjustedToIndex, 0, movedSection);

    if (onSectionsChange) {
      onSectionsChange(newSections);
    }
  };

  // 指定されたインデックスがグループ内かどうかをチェック
  const isInsideGroup = (index: number): boolean => {
    for (let i = index - 1; i >= 0; i--) {
      if (sections[i].layout === "group-start") {
        // グループ開始が見つかった場合、対応する終了があるかチェック
        for (let j = i + 1; j < sections.length; j++) {
          if (sections[j].layout === "group-end") {
            // 終了が見つかり、indexがその範囲内にある場合はグループ内
            return index > i && index < j;
          }
        }
        return true; // 終了が見つからない場合もグループ内とみなす
      } else if (sections[i].layout === "group-end") {
        // 終了タグが先に見つかった場合はグループ外
        return false;
      }
    }
    return false;
  };

  // グループ全体を移動する関数（UX向上版）
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

    // グループ全体を取得
    const groupSections = sections.slice(groupStartIndex, groupEndIndex + 1);

    // 新しい配列を作成：グループを除いた状態
    const sectionsWithoutGroup = [
      ...sections.slice(0, groupStartIndex),
      ...sections.slice(groupEndIndex + 1),
    ];

    // 挿入位置を計算（UX向上のため+1調整）
    let insertIndex;

    if (targetIndex < groupStartIndex) {
      // 前方への移動：targetIndexの位置に挿入
      insertIndex = targetIndex;
    } else if (targetIndex > groupEndIndex) {
      // 後方への移動：UX向上のため、ドロップ先の後ろに挿入
      if (targetIndex >= sections.length - 1) {
        // 最後尾の場合は配列の最後に挿入
        insertIndex = sectionsWithoutGroup.length;
      } else {
        // 通常の後方移動：ドロップ先の後ろに挿入するため+1調整
        insertIndex = targetIndex - groupSections.length + 1;
      }
    } else {
      // グループ内への移動は無効（既にチェック済み）
      return;
    }

    // 境界値チェック
    insertIndex = Math.max(
      0,
      Math.min(insertIndex, sectionsWithoutGroup.length)
    );

    // 新しい位置にグループを挿入
    const finalSections = [
      ...sectionsWithoutGroup.slice(0, insertIndex),
      ...groupSections,
      ...sectionsWithoutGroup.slice(insertIndex),
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
              groupColors={getGroupColor(section.id)}
            />
          </li>
        );

        // 折りたたまれていない場合のみ、グループ内セクションを表示
        if (!isCollapsed) {
          groupSections.forEach(
            ({ section: groupSection, index: groupIndex }) => {
              const isGroupSectionActive = activeSectionIndex === groupIndex;
              // グループの色を取得
              const groupColors = getGroupColor(section.id);

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
                    groupColors={groupColors}
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
                isActive={isEndActive}
                groupStartId={section.id}
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
              groupColors={getGroupColor(section.id)}
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
              groupColors={getGroupColor(section.id)}
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
        items={sections.map((section) => section.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul role="list" aria-label="セクション一覧">
          {renderItems()}

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
              groupColors={getGroupColor(draggedSection.id)}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
