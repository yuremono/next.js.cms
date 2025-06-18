"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/types";
import { toast } from "sonner";
import { ImageIcon, LayoutGrid, Mail, Copy, FolderOpen } from "lucide-react";

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
  const listRef = useRef<HTMLDivElement>(null);

  // セクションタイプに応じた表示名を取得
  const getSectionTitle = (section: Section) => {
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
      case "group-start":
        return `<article>${section.name || "グループ開始"}`;
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
        return <ImageIcon className="mr-1 w-3 flex-shrink-0 text-slate-500" />;
      case "imgText":
        return <Copy className="mr-1 w-3 flex-shrink-0 text-green-500" />;
      case "cards":
        return <LayoutGrid className="mr-1 w-3 flex-shrink-0 text-blue-500" />;
      case "form":
        return <Mail className="mr-1 w-3 flex-shrink-0 text-orange-500" />;
      case "group-start":
        return (
          <FolderOpen className="mr-1 w-3 flex-shrink-0 text-purple-500" />
        );
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

  // キーボードイベントハンドラー
  useEffect(() => {
    if (!focusMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
          // セクション編集画面表示
          onSectionClick(focusedIndex);
          setFocusMode(false);
          break;
        }
        case "Delete":
        case "Backspace": {
          e.preventDefault();
          // 複数選択削除対応
          if (selectedIndices.size > 1) {
            const sortedIndices = Array.from(selectedIndices).sort(
              (a, b) => b - a
            );
            if (
              confirm(
                `選択された${sortedIndices.length}個のセクションを削除してもよろしいですか？`
              )
            ) {
              // 逆順で削除（インデックスの整合性を保つため）
              sortedIndices.forEach((index) => {
                onSectionDelete(index);
              });
              // フォーカスを調整
              const remainingCount = sections.length - sortedIndices.length;
              if (remainingCount > 0) {
                const newIndex = Math.min(
                  sortedIndices[sortedIndices.length - 1],
                  remainingCount - 1
                );
                setFocusedIndex(newIndex >= 0 ? newIndex : 0);
                setSelectedIndices(new Set([newIndex >= 0 ? newIndex : 0]));
                setLastSelectedIndex(newIndex >= 0 ? newIndex : 0);
              } else {
                setFocusedIndex(null);
                setSelectedIndices(new Set());
                setLastSelectedIndex(null);
                setFocusMode(false);
              }
              toast.success(
                `${sortedIndices.length}個のセクションを削除しました`
              );
            }
          } else {
            // 単一削除
            const section = sections[focusedIndex];
            const sectionName = getSectionTitle(section);

            if (confirm(`「${sectionName}」を削除してもよろしいですか？`)) {
              onSectionDelete(focusedIndex);
              // フォーカスを調整
              const newIndex = Math.min(focusedIndex, sections.length - 2);
              setFocusedIndex(newIndex >= 0 ? newIndex : null);
              setSelectedIndices(new Set(newIndex >= 0 ? [newIndex] : []));
              setLastSelectedIndex(newIndex >= 0 ? newIndex : null);
              if (newIndex < 0) {
                setFocusMode(false);
              }
              toast.success("セクションを削除しました");
            }
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setFocusMode(false);
          setFocusedIndex(null);
          setSelectedIndices(new Set());
          setLastSelectedIndex(null);
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
    sections,
    onSectionMove,
    onSectionClick,
    onSectionDelete,
  ]);

  // セクションクリック（選択）
  const handleSectionClick = (index: number, e?: React.MouseEvent) => {
    onSectionClick(index);
    if (focusMode) {
      // フォーカスモード中なら、フォーカスも移動
      setFocusedIndex(index);

      if (e?.shiftKey && lastSelectedIndex !== null) {
        // Shift+クリック: 範囲選択
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
  };

  // セクションダブルクリック（フォーカスモード開始）
  const handleSectionDoubleClick = (index: number) => {
    setFocusMode(true);
    setFocusedIndex(index);
    setSelectedIndices(new Set([index]));
    setLastSelectedIndex(index);
    onSectionClick(index); // クリックも連動
    toast.info("IDE風フォーカスモード開始 (Escで終了)");
  };

  // セクションリスト全体のダブルクリック（フォーカスモード開始）
  const handleListDoubleClick = (e: React.MouseEvent) => {
    // 特定のセクションではなく、リスト全体がダブルクリックされた場合
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest(".space-y-1") === e.currentTarget
    ) {
      const currentIndex = activeSectionIndex !== null ? activeSectionIndex : 0;
      if (sections.length > 0) {
        setFocusMode(true);
        setFocusedIndex(currentIndex);
        setSelectedIndices(new Set([currentIndex]));
        setLastSelectedIndex(currentIndex);
        toast.info("IDE風フォーカスモード開始 (Escで終了)");
      }
    }
  };

  return (
    <div
      ref={listRef}
      className={`space-y-1 ${focusMode ? "rounded-md p-2 ring-2 ring-slate-500 ring-opacity-50" : ""}`}
      onDoubleClick={handleListDoubleClick}
    >
      {focusMode && (
        <div className="fixed bottom-2 left-2 right-2 rounded-md bg-white p-4 text-center text-sm text-gray-700 shadow-lg">
          IDE風モード: ↑↓で選択, shift+↑↓で複数選択,
          cmd/ctrl+クリックで個別選択, option+↑↓で移動, Enterで編集,
          Delete/Backspaceで削除, Escで終了
          {selectedIndices.size > 1 && (
            <span className="ml-2 font-medium text-gray-900">
              ({selectedIndices.size}個選択中)
            </span>
          )}
        </div>
      )}

      {sections.map((section, index) => {
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
                  border: "#ccc",
                  bgWithAlpha: "rgba(204, 204, 204, 0.3)",
                  text: "#666",
                };

          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={`h-6 min-w-[50%] justify-start px-2 py-1 text-left font-normal ${
                isFocused ? "ring-2 ring-slate-400 ring-offset-1" : ""
              } ${
                isSelected && focusMode
                  ? "bg-slate-500/20 ring-1 ring-slate-300"
                  : ""
              } border-l-2 font-medium`}
              style={{
                ...indentStyle,
                ...groupWidthStyle,
                borderLeftColor: groupColors.border,
                backgroundColor: isActive ? groupColors.bgWithAlpha : undefined,
                color: isActive ? groupColors.text : undefined,
              }}
              onClick={(e) => handleSectionClick(index, e)}
              onDoubleClick={() => handleSectionDoubleClick(index)}
              title={`${getSectionTitle(section)} (ダブルクリックでIDE風モード)`}
              data-layout={section.layout}
            >
              <div className="flex min-w-0 flex-1 items-center">
                <span className="flex-1 truncate">
                  {getSectionTitle(section)}
                </span>
                {focusMode && isFocused && (
                  <span className="ml-2 text-xs opacity-75">●</span>
                )}
              </div>
            </Button>
          );
        }

        // 通常のセクションとグループ開始タグ
        const groupColors = isGroupStart ? getGroupColor(section.id) : null;

        return (
          <Button
            key={section.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={`h-6 min-w-[50%] justify-start px-2 py-1 text-left font-normal ${
              isFocused ? "ring-2 ring-slate-400 ring-offset-1" : ""
            } ${
              isSelected && focusMode
                ? "bg-slate-500/20 ring-1 ring-slate-300"
                : ""
            } ${isGroupStart ? "border-l-2 font-medium" : ""}`}
            style={
              isGroupStart && groupColors
                ? {
                    ...indentStyle,
                    ...groupWidthStyle,
                    borderLeftColor: groupColors.border,
                    backgroundColor: isActive
                      ? groupColors.bgWithAlpha
                      : `${groupColors.border}30`, // 30%透明度
                    color: isActive ? groupColors.text : undefined,
                  }
                : { ...indentStyle, ...groupWidthStyle }
            }
            onClick={(e) => handleSectionClick(index, e)}
            onDoubleClick={() => handleSectionDoubleClick(index)}
            title={`${getSectionTitle(section)} (ダブルクリックでIDE風モード)`}
            data-layout={section.layout}
          >
            <div className="flex min-w-0 flex-1 items-center">
              {getSectionIcon(section)}
              <span className="flex-1 truncate">
                {getSectionTitle(section)}
              </span>
              {focusMode && isFocused && (
                <span className="ml-2 text-xs opacity-75">●</span>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
}
