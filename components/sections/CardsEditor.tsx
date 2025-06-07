"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/ui/editor";
import { ImageUpload } from "@/components/images/ImageUpload";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Card as UICard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardsSection, Card } from "@/types";
import { Plus, Trash, GripVertical } from "lucide-react";

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
	card: Card; // cardは使用されていませんが、型定義として残しておきます
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
		<div
			ref={setNodeRef}
			style={style}
			className={`p-2 border rounded flex justify-between items-center cursor-pointer ${
				isActive
					? "border-blue-500 bg-blue-50"
					: "hover:border-gray-300"
			}`}
			onClick={onSelect}
		>
			<div className="flex items-center">
				<div
					{...attributes}
					{...listeners}
					className="cursor-grab mr-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
				>
					<GripVertical className="h-4 w-4" />
				</div>
				<span className="truncate text-sm">カード {index + 1}</span>
			</div>
			<Button
				variant="ghost"
				size="icon"
				className="h-5 w-5 text-red-500 hover:text-red-600 flex-shrink-0"
				onClick={(e) => {
					e.stopPropagation();
					if (
						window.confirm("このカードを削除してもよろしいですか？")
					) {
						onDelete();
					}
				}}
			>
				<Trash className="h-3 w-3" />
			</Button>
		</div>
	);
};

export function CardsEditor({ section, onUpdate }: CardsEditorProps) {
	const [activeCardIndex, setActiveCardIndex] = useState<number | null>(
    section.cards.length > 0 ? 0 : null
  );

  // カードの更新を処理
  const updateCard = (index: number, key: keyof Card, value: string | null) => {
    const updatedCards = [...section.cards];
    updatedCards[index] = {
      ...updatedCards[index],
      [key]: value || undefined,
    };
    onUpdate({
      ...section,
      cards: updatedCards,
    });
  };

  // 新しいカードを追加
  const addCard = () => {
    const newCard: Card = {
      image: "",
      imageClass: "",
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
  const handleClassNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...section,
      class: e.target.value,
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
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...section,
      name: e.target.value,
    });
  };

  return (
    <div className="CardsEditor space-y-6">
      <UICard className="p-4">
        <h3 className="mb-4 text-lg font-medium">カードセクション設定</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="cards-name">
              セクション名
            </Label>
            <Input
              id="cards-name"
              value={section.name || ""}
              onChange={handleNameChange}
              placeholder="例: カード"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="cards-class">
              セクションクラス
            </Label>
            <Input
              id="cards-class"
              value={section.class}
              onChange={handleClassNameChange}
              placeholder="例: cards-section py-8"
              className="flex-1"
            />
          </div>
          <BackgroundImageUpload
            initialImage={section.bgImage}
            onImageChange={handleBgImageChange}
            label="背景画像"
          />

          <div className="mt-4 border-t pt-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-md font-medium">
                カード ({section.cards.length})
              </h4>
              <Button size="sm" onClick={addCard}>
                <Plus className="mr-1 h-4 w-4" />
                カードを追加
              </Button>
            </div>
            {section.cards.length === 0 ? (
              <div className="rounded border border-dashed p-8 text-center">
                <p className="mb-4 text-gray-500">カードがありません</p>
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
              >
                <SortableContext
                  items={section.cards.map((_, i) => `card-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="space-y-2 md:w-1/3">
                      {section.cards.map((card, index) => (
                        <SortableCardItem
                          key={`card-${index}`}
                          card={card}
                          index={index}
                          isActive={activeCardIndex === index}
                          onSelect={() => setActiveCardIndex(index)}
                          onDelete={() => removeCard(index)}
                        />
                      ))}
                    </div>
                    {activeCardIndex !== null && (
                      <div className="md:w-2/3">
                        <UICard className="p-4">
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
                              <RichTextEditor
                                content={section.cards[activeCardIndex]?.html}
                                onChange={(html) =>
                                  updateCard(activeCardIndex, "html", html)
                                }
                              />
                            </div>
                          </div>
                        </UICard>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </UICard>
    </div>
  );
}
