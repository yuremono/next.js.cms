"use client";

import { useState } from "react";
import { SimpleHtmlEditor } from "@/components/ui/simple-html-editor";
import { ImageUpload } from "@/components/images/ImageUpload";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardsSection, Card as CardType } from "@/types";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { getImageAspectRatio } from "@/lib/image-utils";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardsEditorProps {
  section: CardsSection;
  onUpdate: (section: CardsSection) => void;
}

// ドラッグ可能なカードアイテムのコンポーネント
const SortableCardItem = ({
  index,
  onSelect,
  onDelete,
  isActive,
}: {
  card: CardType; // cardは使用されていませんが、型定義として残しておきます
  index: number;
  onSelect: () => void;
  onDelete: () => void;
  isActive: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `card-${index}`,
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
      } mb-2 cursor-pointer transition-colors`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            {...attributes}
            {...listeners}
            className="mr-2 cursor-grab text-gray-400 hover:text-gray-600"
            role="button"
            aria-label={`カード ${index + 1} をドラッグして並び替え`}
            tabIndex={0}
          >
            <GripVertical className="h-4 w-4 flex-shrink-0" />
          </div>
          <span className="text-sm">カード {index + 1}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-600"
            aria-label={`カード ${index + 1} を削除`}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("このカードを削除してもよろしいですか？")) {
                onDelete();
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export function CardsEditor({ section, onUpdate }: CardsEditorProps) {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(
    section.cards.length > 0 ? 0 : null
  );

  // カードの更新を処理
  const updateCard = async (
    index: number,
    key: keyof CardType,
    value: string | null
  ) => {
    const updatedCards = [...section.cards];

    if (key === "image") {
      if (value) {
        try {
          // 画像比率を取得
          const aspectRatio = await getImageAspectRatio(value);
          updatedCards[index] = {
            ...updatedCards[index],
            image: value,
            imageAspectRatio: aspectRatio,
          };
        } catch (error) {
          console.error("画像比率の取得に失敗しました:", error);
          updatedCards[index] = {
            ...updatedCards[index],
            image: value,
            imageAspectRatio: "auto",
          };
        }
      } else {
        updatedCards[index] = {
          ...updatedCards[index],
          image: undefined,
          imageAspectRatio: undefined,
        };
      }
    } else {
      updatedCards[index] = {
        ...updatedCards[index],
        [key]: value || undefined,
      };
    }

    onUpdate({
      ...section,
      cards: updatedCards,
    });
  };

  // 新しいカードを追加
  const addCard = () => {
    const newCard: CardType = {
      image: "",
      imageClass: "",
      imageAspectRatio: "auto",
      textClass: "",
      html: "<h3>新しいカード</h3><p>ここにカードの内容を入力してください。</p>",
    };
    const updatedCards = [...section.cards, newCard];
    onUpdate({
      ...section,
      cards: updatedCards,
    });
    setActiveCardIndex(updatedCards.length - 1);
  };

  // カードを削除
  const removeCard = (index: number) => {
    const updatedCards = section.cards.filter((_, i) => i !== index);
    onUpdate({
      ...section,
      cards: updatedCards,
    });
    if (activeCardIndex === index) {
      setActiveCardIndex(updatedCards.length > 0 ? 0 : null);
    } else if (activeCardIndex !== null && index < activeCardIndex) {
      setActiveCardIndex(activeCardIndex - 1);
    }
  };

  // カードの並び替えを処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = section.cards.findIndex(
        (card, i) => `card-${i}` === active.id
      );
      const newIndex = section.cards.findIndex(
        (card, i) => `card-${i}` === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedCards = arrayMove(section.cards, oldIndex, newIndex);
        onUpdate({ ...section, cards: updatedCards });
        // 並び替え後に選択状態を維持
        const newActiveIndex = updatedCards.findIndex(
          (card) => card === section.cards[oldIndex]
        );
        setActiveCardIndex(newActiveIndex);
      }
    }
  };

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

  // クラス名の変更
  const handleClassNameChange = (value: string) => {
    onUpdate({
      ...section,
      class: value,
    });
  };

  // 背景画像の変更
  const handleBgImageChange = (img: string | null) => {
    onUpdate({
      ...section,
      bgImage: img || undefined,
    });
  };

  // セクション名の変更
  const handleNameChange = (value: string) => {
    onUpdate({
      ...section,
      name: value,
    });
  };

  // セクション幅の変更
  const handleSectionWidthChange = (value: string) => {
    onUpdate({
      ...section,
      sectionWidth: value,
    });
  };

  return (
    <div className="CardsEditor flex-1 space-y-6">
      <Card className="flex h-full flex-col rounded-sm p-4">
        <h3 className="mb-4 text-lg font-medium">カードセクション設定</h3>
        <div className="flex flex-1 flex-col space-y-4">
          <FormField
            id="cards-name"
            label="セクション名"
            value={section.name || ""}
            onChange={handleNameChange}
            placeholder="例: カード"
          />
          <FormField
            id="cards-class"
            label="セクションクラス"
            value={section.class}
            onChange={handleClassNameChange}
            placeholder="例: Cards py-8"
          />
          <FormField
            id="cards-section-width"
            label="セクション幅"
            value={section.sectionWidth || ""}
            onChange={handleSectionWidthChange}
            placeholder="例: max-w-6xl"
          />
          <BackgroundImageUpload
            initialImage={section.bgImage}
            onImageChange={handleBgImageChange}
            label="背景画像"
          />

          <div className="mt-4 flex flex-1 flex-col border-t pt-4">
            <div className="mb-4 flex items-center gap-4">
              <h4 className="text-md w-32 font-medium">
                カード ({section.cards.length})
              </h4>
              <Button size="sm" onClick={addCard}>
                <Plus className="mr-1 h-4 w-4" />
                カードを追加
              </Button>
            </div>
            {section.cards.length === 0 ? (
              <div className="rounded border border-dashed p-8 text-center">
                <p className="mb-4 text-muted-foreground">カードがありません</p>
                <Button onClick={addCard}>
                  <Plus className="mr-1 h-4 w-4" />
                  最初のカードを追加
                </Button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                // className={"flex-1"}
              >
                <SortableContext
                  items={section.cards.map((_, i) => `card-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-4 md:flex-row ">
                    <ul
                      className="space-y-2 md:w-32"
                      role="list"
                      aria-label="カード一覧"
                    >
                      {section.cards.map((card, index) => (
                        <li key={`card-${index}`}>
                          <SortableCardItem
                            card={card}
                            index={index}
                            isActive={activeCardIndex === index}
                            onSelect={() => setActiveCardIndex(index)}
                            onDelete={() => removeCard(index)}
                          />
                        </li>
                      ))}
                    </ul>
                    {activeCardIndex !== null && (
                      <div className="h-full md:flex-1">
                        <Card className="rounded-sm p-4">
                          <h4 className="text-md mb-4 font-medium">
                            カード {activeCardIndex + 1} を編集
                          </h4>
                          <div className="space-y-4">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                              <div className="w-full">
                                <ImageUpload
                                  label="画像クラス"
                                  initialImage={
                                    section.cards[activeCardIndex]?.image
                                  }
                                  initialClass={
                                    section.cards[activeCardIndex]
                                      ?.imageClass || ""
                                  }
                                  onImageChange={(url) =>
                                    updateCard(activeCardIndex, "image", url)
                                  }
                                  onClassChange={(className) =>
                                    updateCard(
                                      activeCardIndex,
                                      "imageClass",
                                      className
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-4">
                                <Label
                                  className=""
                                  htmlFor={`card-${activeCardIndex}-text-class`}
                                >
                                  テキストクラス
                                </Label>
                                <Input
                                  id={`card-${activeCardIndex}-text-class`}
                                  className="flex-1"
                                  value={
                                    section.cards[activeCardIndex]?.textClass ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateCard(
                                      activeCardIndex,
                                      "textClass",
                                      e.target.value
                                    )
                                  }
                                  placeholder="例: card-content"
                                />
                              </div>
                              <SimpleHtmlEditor
                                value={
                                  section.cards[activeCardIndex]?.html || ""
                                }
                                onChange={(html) =>
                                  updateCard(activeCardIndex, "html", html)
                                }
                                autoConvertLineBreaks={true}
                                compact={true}
                              />
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
