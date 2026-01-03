"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/types";
import { toast } from "sonner";
import {
  ImageIcon,
  LayoutGrid,
  Mail,
  Copy,
  FolderOpen,
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

// セクションのインデント階層を計算する関数
const calculateIndentLevel = (
  sections: Section[],
  currentIndex: number
): number => {
  let indentLevel = 0;

  // 現在のセクションより前のセクションを順次確認
  for (let i = 0; i < currentIndex; i++) {
    const section = sections[i];
    if (section.layout === "group-start") {
      indentLevel++;
    } else if (section.layout === "group-end") {
      indentLevel = Math.max(0, indentLevel - 1);
    }
  }

  // 現在のセクションがgroup-endの場合は1つ戻す
  if (sections[currentIndex]?.layout === "group-end") {
    indentLevel = Math.max(0, indentLevel - 1);
  }

  return indentLevel;
};

interface IDEStyleSectionListProps {
  sections: Section[];
  activeSectionIndex: number | null;
  onSectionClick: (index: number) => void;
  onSectionMove: (fromIndex: number, toIndex: number) => void;
  onSectionDelete: (index: number) => void;
  onSectionAdd?: (type: string, afterIndex?: number) => void;
  sectionsOrder?: string; // "id1,id2,id3" 形式
  onSectionsOrderChange?: (order: string) => void;
}

export default function IDEStyleSectionList({
  sections,
  activeSectionIndex,
  onSectionClick,
  onSectionMove,
  onSectionDelete,
}: IDEStyleSectionListProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set()
  );
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const [toastShown, setToastShown] = useState(false); // トースト重複防止用
  const listRef = useRef<HTMLDivElement>(null);

  // ドラッグ&ドロップの状態
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ドラッグ&ドロップのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px移動してからドラッグ開始（誤操作防止）
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // セクションタイプに応じた表示名を取得
  const getSectionTitle = (section: Section | null | undefined) => {
    // sectionがnullまたはundefinedの場合
    if (!section || typeof section !== "object") {
      return "不明なセクション";
    }

    // nameプロパティがある場合
    if ("name" in section && section.name) {
      return section.name;
    }

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
  const getSectionIcon = (section: Section | null | undefined) => {
    if (!section || typeof section !== "object") {
      return null;
    }

    switch (section.layout) {
      case "mainVisual":
        return <ImageIcon className="mr-1 w-3 flex-shrink-0 text-slate-500" />;
      case "imgText":
        return <Copy className="mr-1 w-3 flex-shrink-0 text-green-500" />;
      case "cards":
        return <LayoutGrid className="mr-1 w-3 flex-shrink-0 text-blue-500" />;
      case "form":
        return <Mail className="mr-1 w-3 flex-shrink-0 text-orange-500" />;
      case "descList":
        return <FileText className="mr-1 w-3 flex-shrink-0 text-cyan-500" />;
      case "htmlContent":
        return <SquareCode className="mr-1 w-3 flex-shrink-0 text-slate-600" />;
      case "group-start":
        return <FolderOpen className="mr-1 w-3 flex-shrink-0 text-current" />;
      case "group-end":
        return null;
      default:
        return null;
    }
  };

  // グループ色生成関数（既存のロジックを継承）
  const getGroupColor = (groupId: string) => {
    const allGroupIds = sections
      .filter((section) => section.layout === "group-start")
      .map((section) => section.id)
      .sort();

    const groupIndex = allGroupIds.indexOf(groupId);
    const baseHue = 215;
    const hueStep = 36;
    const hue = (baseHue + groupIndex * hueStep) % 360;
    const saturation = 45;
    const lightness = 65;

    return {
      border: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      bgWithAlpha: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`,
      text: `hsl(${hue}, ${saturation}%, ${lightness - 20}%)`,
    };
  };

  // ドラッグ開始ハンドラー
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);

    // ドラッグ中はフォーカスモードを一時無効化
    if (focusMode) {
      toast.info("ドラッグ中はキーボード操作が無効になります");
    }

    // モバイルでのスクロール防止（ドラッグ中のみ）
    document.body.style.touchAction = "none";
    document.body.style.userSelect = "none";
  };

  // ドラッグ終了ハンドラー
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setIsDragging(false);

    // スクロール制限を解除
    document.body.style.touchAction = "";
    document.body.style.userSelect = "";

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sections.findIndex((section) => section.id === active.id);
    const newIndex = sections.findIndex((section) => section.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // 既存のonSectionMoveを使用してセクション移動（トーストなし）
      onSectionMove(oldIndex, newIndex);
    }
  };

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      // コンポーネントが破棄される際にtouch-actionを復元
      document.body.style.touchAction = "";
      document.body.style.userSelect = "";
    };
  }, []);

  // キーボードイベントハンドラー
  useEffect(() => {
    if (!focusMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ドラッグ中はキーボード操作を無効化
      if (isDragging) return;

      // エディタがフォーカスされている場合はキーボードイベントを無視
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "INPUT" ||
          (activeElement as HTMLElement).contentEditable === "true" ||
          activeElement.closest(".SimpleHtmlEditor") ||
          activeElement.closest(".monaco-editor") ||
          activeElement.closest("[data-keybinding-context]") || // Monaco Editor内部要素
          activeElement.classList.contains("monaco-editor") ||
          activeElement.classList.contains("view-line"))
      ) {
        return; // エディタなどの入力フィールドでは何もしない
      }

      if (focusedIndex === null) return;

      switch (e.key) {
        case "ArrowUp": {
          e.preventDefault();
          if (e.altKey) {
            // option+↑: セクション位置を上に移動（複数選択対応）
            if (selectedIndices.size > 0) {
              const sortedIndices = Array.from(selectedIndices).sort(
                (a, b) => a - b
              );
              const canMoveUp = sortedIndices[0] > 0;

              if (canMoveUp) {
                // 選択されたセクションを全て上に移動
                const newSelectedIndices = new Set<number>();
                sortedIndices.forEach((index) => {
                  onSectionMove(index, index - 1);
                  newSelectedIndices.add(index - 1);
                });
                setSelectedIndices(newSelectedIndices);
                setFocusedIndex(focusedIndex! - 1);
              }
            }
          } else if (e.shiftKey) {
            // shift+↑: 複数選択を拡張/縮小
            const newIndex = Math.max(0, focusedIndex - 1);

            if (lastSelectedIndex !== null) {
              // 範囲選択の拡張/縮小
              const newSelected = new Set<number>();
              const start = Math.min(lastSelectedIndex, newIndex);
              const end = Math.max(lastSelectedIndex, newIndex);
              for (let i = start; i <= end; i++) {
                newSelected.add(i);
              }
              setSelectedIndices(newSelected);
            } else {
              // 初回範囲選択
              const newSelected = new Set(selectedIndices);
              newSelected.add(newIndex);
              setSelectedIndices(newSelected);
            }

            setFocusedIndex(newIndex);
          } else {
            // ↑: フォーカスを上に移動（単一選択）
            const newIndex = Math.max(0, focusedIndex - 1);
            setFocusedIndex(newIndex);
            setSelectedIndices(new Set([newIndex]));
            setLastSelectedIndex(newIndex);
          }
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          if (e.altKey) {
            // option+↓: セクション位置を下に移動（複数選択対応）
            if (selectedIndices.size > 0) {
              const sortedIndices = Array.from(selectedIndices).sort(
                (a, b) => b - a
              );
              const canMoveDown = sortedIndices[0] < sections.length - 1;

              if (canMoveDown) {
                // 選択されたセクションを全て下に移動（逆順で処理）
                const newSelectedIndices = new Set<number>();
                sortedIndices.forEach((index) => {
                  onSectionMove(index, index + 1);
                  newSelectedIndices.add(index + 1);
                });
                setSelectedIndices(newSelectedIndices);
                setFocusedIndex(focusedIndex! + 1);
              }
            }
          } else if (e.shiftKey) {
            // shift+↓: 複数選択を拡張/縮小
            const newIndex = Math.min(sections.length - 1, focusedIndex + 1);

            if (lastSelectedIndex !== null) {
              // 範囲選択の拡張/縮小
              const newSelected = new Set<number>();
              const start = Math.min(lastSelectedIndex, newIndex);
              const end = Math.max(lastSelectedIndex, newIndex);
              for (let i = start; i <= end; i++) {
                newSelected.add(i);
              }
              setSelectedIndices(newSelected);
            } else {
              // 初回範囲選択
              const newSelected = new Set(selectedIndices);
              newSelected.add(newIndex);
              setSelectedIndices(newSelected);
            }

            setFocusedIndex(newIndex);
          } else {
            // ↓: フォーカスを下に移動（単一選択）
            const newIndex = Math.min(sections.length - 1, focusedIndex + 1);
            setFocusedIndex(newIndex);
            setSelectedIndices(new Set([newIndex]));
            setLastSelectedIndex(newIndex);
          }
          break;
        }
        case "Enter": {
          e.preventDefault();
          // セクションを編集
          if (focusedIndex !== null) {
            onSectionClick(focusedIndex);
          }
          break;
        }
        case "Delete":
        case "Backspace": {
          e.preventDefault();
          // 選択されたセクションを削除（確認アラート付き）
          if (selectedIndices.size > 0) {
            const sectionNames = Array.from(selectedIndices)
              .sort((a, b) => a - b)
              .map((index) => getSectionTitle(sections[index]))
              .join(", ");

            const message =
              selectedIndices.size === 1
                ? `「${sectionNames}」を削除しますか？`
                : `${selectedIndices.size}個のセクション（${sectionNames}）を削除しますか？`;

            if (confirm(message)) {
              const sortedIndices = Array.from(selectedIndices).sort(
                (a, b) => b - a
              );
              sortedIndices.forEach((index) => {
                onSectionDelete(index);
              });
              setSelectedIndices(new Set());
              setFocusedIndex(null);
            }
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          // フォーカスモードを終了
          setFocusMode(false);
          setFocusedIndex(null);
          setSelectedIndices(new Set());
          setLastSelectedIndex(null);
          toast.info("フォーカスモード終了");
          break;
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setFocusMode(false);
        setFocusedIndex(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [
    focusMode,
    focusedIndex,
    selectedIndices,
    lastSelectedIndex,
    sections.length,
    onSectionMove,
    onSectionDelete,
    isDragging,
  ]);

  // セクションクリックハンドラー
  const handleSectionClick = (index: number, e?: React.MouseEvent) => {
    if (focusMode) {
      // フォーカスモード中の選択処理
      if (e?.shiftKey && lastSelectedIndex !== null) {
        // 範囲選択
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        const newSelected = new Set<number>();
        for (let i = start; i <= end; i++) {
          newSelected.add(i);
        }
        setSelectedIndices(newSelected);
      } else if (e?.ctrlKey || e?.metaKey) {
        // Ctrl/Cmd+クリック: 複数選択切り替え
        const newSelected = new Set(selectedIndices);
        if (newSelected.has(index)) {
          newSelected.delete(index);
        } else {
          newSelected.add(index);
        }
        setSelectedIndices(newSelected);
        setLastSelectedIndex(index);
      } else {
        // 通常クリック: 単一選択
        setSelectedIndices(new Set([index]));
        setLastSelectedIndex(index);
      }
    }

    // フォーカスを設定（フォーカスモード時のみ）
    if (focusMode) {
      setFocusedIndex(index);
    }

    // 親コンポーネントに通知
    onSectionClick(index);
  };

  // セクションダブルクリック（フォーカスモード開始）
  const handleSectionDoubleClick = (index: number, e?: React.MouseEvent) => {
    // イベントバブリングを防ぐ
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const wasAlreadyFocusMode = focusMode;
    setFocusMode(true);
    setFocusedIndex(index);
    setSelectedIndices(new Set([index]));
    setLastSelectedIndex(index);
    onSectionClick(index); // クリックも連動

    // 既にフォーカスモードの場合、またはトーストが既に表示済みの場合は表示しない
    if (!wasAlreadyFocusMode && !toastShown) {
      toast.info("フォーカスモード開始 (Escで終了)");
      setToastShown(true);
      // 少し待ってからトースト表示状態をリセット
      setTimeout(() => setToastShown(false), 500);
    }
  };

  // セクションリスト全体のダブルクリック（フォーカスモード開始）
  const handleListDoubleClick = (e: React.MouseEvent) => {
    // 特定のセクションではなく、リスト全体がダブルクリックされた場合
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest(".space-y-1") === e.currentTarget
    ) {
      const currentIndex = activeSectionIndex !== null ? activeSectionIndex : 0;
      if (sections.length > 0 && !focusMode && !toastShown) {
        // 既にフォーカスモードまたはトースト表示済みの場合は何もしない
        setFocusMode(true);
        setFocusedIndex(currentIndex);
        setSelectedIndices(new Set([currentIndex]));
        setLastSelectedIndex(currentIndex);
        toast.info("フォーカスモード開始 (Escで終了)");
        setToastShown(true);
        // 少し待ってからトースト表示状態をリセット
        setTimeout(() => setToastShown(false), 500);
      }
    }
  };

  // ソート可能なセクションアイテムコンポーネント
  const SortableItem = ({
    section,
    index,
  }: {
    section: Section;
    index: number;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging: isItemDragging,
    } = useSortable({ id: section.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isItemDragging ? 0.5 : 1,
    };

    const isActive = activeSectionIndex === index;
    const isFocused = focusMode && focusedIndex === index;
    const isSelected = selectedIndices.has(index);
    const isGroupStart = section.layout === "group-start";
    const isGroupEnd = section.layout === "group-end";
    const indentLevel = calculateIndentLevel(sections, index);
    const indentStyle = { marginLeft: `${indentLevel * 0.5}rem` };

    // グループstart/endの場合は幅も調整
    const groupWidthStyle =
      isGroupStart || isGroupEnd
        ? {
            width: `calc(100% - ${indentLevel * 0.5}rem)`,
          }
        : {};

    // グループ終了タグの場合
    if (isGroupEnd) {
      // 対応する開始タグを見つける
      let startIndex = -1;
      let groupDepth = 0;
      for (let i = index - 1; i >= 0; i--) {
        if (sections[i].layout === "group-end") {
          groupDepth++;
        } else if (sections[i].layout === "group-start") {
          if (groupDepth === 0) {
            startIndex = i;
            break;
          }
          groupDepth--;
        }
      }

      const groupColors =
        startIndex >= 0
          ? getGroupColor(sections[startIndex].id)
          : {
              border: "var(--border)",
              bgWithAlpha: "rgba(204, 204, 204, 0.3)",
              text: "var(--gr)",
            };

      return (
        <Button
          ref={setNodeRef}
          style={{
            ...style,
            ...indentStyle,
            ...groupWidthStyle,
            borderLeftColor: groupColors.border,
            color: isActive ? undefined : undefined,
            touchAction: "none", // モバイルでのスクロール防止
          }}
          {...attributes}
          {...listeners}
          variant="ghost"
          size="sm"
          className={`text-sm min-w-[51%] justify-start px-2 py-1 text-left font-normal ${
            isFocused ? "ring-2 ring-slate-400 ring-offset-1" : ""
          } ${
            isSelected && focusMode
              ? "bg-slate-500/20 ring-1 ring-slate-300"
              : ""
          } border-l-2 font-medium`}
          onClick={(e) => handleSectionClick(index, e)}
          onDoubleClick={(e) => handleSectionDoubleClick(index, e)}
          title={`${getSectionTitle(section)} (ダブルクリックでフォーカスモード)`}
          data-layout={section.layout}
        >
          <div className="flex min-w-0 flex-1 items-center">
            <span className="flex-1 truncate">{getSectionTitle(section)}</span>
            {focusMode && isFocused && (
              <span className="ml-2 text-sm opacity-75">●</span>
            )}
          </div>
        </Button>
      );
    }

    // 通常のセクションとグループ開始タグ
    const groupColors = isGroupStart ? getGroupColor(section.id) : null;

    return (
      <Button
        ref={setNodeRef}
        style={
          isGroupStart && groupColors
            ? {
                ...style,
                ...indentStyle,
                ...groupWidthStyle,
                borderLeftColor: groupColors.border,
                backgroundColor: isActive
                  ? groupColors.bgWithAlpha
                  : `${groupColors.border}30`, // 30%透明度
                color: isActive ? groupColors.text : undefined,
                touchAction: "none", // モバイルでのスクロール防止
              }
            : {
                ...style,
                ...indentStyle,
                ...groupWidthStyle,
                backgroundColor: isActive//選択時の背景色
                  ? `color-mix(in srgb, var(--primary) 10%, transparent)`
                  : undefined,
                touchAction: "none", // モバイルでのスクロール防止
              }
        }
        {...attributes}
        {...listeners}
        variant="ghost"
        size="sm"
        className={` min-w-[51%] justify-start px-2 py-1 text-left font-normal ${
          isFocused ? "ring-2 ring-slate-400 ring-offset-1" : ""
        } ${
          isSelected && focusMode ? "bg-slate-500/20 ring-1 ring-slate-300" : ""
        } ${isGroupStart ? "border-l-2 font-medium" : ""}`}
        onClick={(e) => handleSectionClick(index, e)}
        onDoubleClick={(e) => handleSectionDoubleClick(index, e)}
        title={`${getSectionTitle(section)} (ダブルクリックでフォーカスモード)`}
        data-layout={section.layout}
      >
        <div className="flex min-w-0 flex-1 items-center">
          {getSectionIcon(section)}
          <span className="flex-1 truncate">{getSectionTitle(section)}</span>
          {focusMode && isFocused && (
            <span className="ml-2 text-sm opacity-75">●</span>
          )}
        </div>
      </Button>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={listRef}
        className={`space-y-1 ${focusMode ? "rounded-md p-2 ring-2 ring-slate-500 ring-opacity-50" : ""}`}
        style={{ touchAction: "pan-y" }} // 縦スクロールのみ許可、ドラッグエリアでは上書き
        onDoubleClick={handleListDoubleClick}
      >
        {focusMode && (
          <div className="fixed bottom-2 left-2 right-2 rounded-md bg-card p-4 text-center text-sm shadow-lg">
            フォーカスモード: ↑↓で選択, shift+↑↓で複数選択,
            cmd/ctrl+クリックで個別選択, option+↑↓で移動, Enterで編集,
            Delete/Backspaceで削除, Escで終了
            {selectedIndices.size > 1 && (
              <span className="ml-2 font-medium">
                ({selectedIndices.size}個選択中)
              </span>
            )}
          </div>
        )}

        <SortableContext
          items={sections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section, index) => (
            <SortableItem key={section.id} section={section} index={index} />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="rounded bg-muted p-2 opacity-90 shadow-lg">
              <span className="text-sm font-medium">
                {getSectionTitle(sections.find((s) => s.id === activeId))}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
 