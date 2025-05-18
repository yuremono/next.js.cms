import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/types";
import {
	Trash2,
	ImageIcon,
	LayoutIcon,
	CreditCard,
	FormInput,
	GripVertical,
} from "lucide-react";
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
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableSectionsProps {
	sections: Section[];
	activeSectionIndex: number | null;
	onSectionClick: (index: number) => void;
	onSectionMove: (fromIndex: number, toIndex: number) => void;
	onSectionDelete: (index: number) => void;
}

// ドラッグ可能なアイテムのコンポーネント
const SortableItem = ({
	section,
	isActive,
	onSelect,
	onDelete,
}: {
	section: Section;
	isActive: boolean;
	onSelect: () => void;
	onDelete: () => void;
}) => {
	// セクションタイプに応じて表示名を取得
	const getSectionTitle = (section: Section) => {
		// セクション名が設定されている場合はそれを表示
		if (section.name) {
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
			default:
				return "不明なセクション";
		}
	};

	// セクションタイプに応じたアイコンを取得
	const getSectionIcon = (section: Section) => {
		switch (section.layout) {
			case "mainVisual":
				return (
					<ImageIcon className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" />
				);
			case "imgText":
				return (
					<LayoutIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
				);
			case "cards":
				return (
					<CreditCard className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" />
				);
			case "form":
				return (
					<FormInput className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" />
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
		<Card
			ref={setNodeRef}
			style={style}
			className={`p-2 ${
				isActive
					? "border-blue-500 bg-blue-50"
					: "hover:border-gray-300"
			} cursor-pointer transition-colors mb-2`}
			onClick={onSelect}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<div
						{...attributes}
						{...listeners}
						className="cursor-grab mr-2 text-gray-400 hover:text-gray-600"
					>
						<GripVertical className="h-4 w-4 flex-shrink-0" />
					</div>
					{getSectionIcon(section)}
					<span className="text-sm">{getSectionTitle(section)}</span>
				</div>
				<div className="flex items-center space-x-1">
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 text-red-500 hover:text-red-600"
						onClick={(e) => {
							e.stopPropagation();
							if (
								window.confirm(
									"このセクションを削除してもよろしいですか？"
								)
							) {
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

export function SortableSections({
	sections,
	activeSectionIndex,
	onSectionClick,
	onSectionMove,
	onSectionDelete,
}: SortableSectionsProps) {
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

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = sections.findIndex(
				(section) => section.id === active.id
			);
			const newIndex = sections.findIndex(
				(section) => section.id === over.id
			);

			if (oldIndex !== -1 && newIndex !== -1) {
				onSectionMove(oldIndex, newIndex);
			}
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={sections.map((section) => section.id)}
				strategy={verticalListSortingStrategy}
			>
				<div>
					{sections.map((section, index) => (
						<SortableItem
							key={section.id}
							section={section}
							isActive={index === activeSectionIndex}
							onSelect={() => onSectionClick(index)}
							onDelete={() => onSectionDelete(index)}
						/>
					))}

					{sections.length === 0 && (
						<div className="text-center p-6 border border-dashed rounded-md">
							<p className="text-gray-500">
								セクションがありません。「セクション追加」ボタンから新しいセクションを追加してください。
							</p>
						</div>
					)}
				</div>
			</SortableContext>
		</DndContext>
	);
}
