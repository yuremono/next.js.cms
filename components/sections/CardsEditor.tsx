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
import { Plus, Trash, MoveUp, MoveDown } from "lucide-react";

interface CardsEditorProps {
	section: CardsSection;
	onUpdate: (section: CardsSection) => void;
}

export function CardsEditor({ section, onUpdate }: CardsEditorProps) {
	// 内部的に管理するのはアクティブなカードインデックスのみとする
	const [activeCardIndex, setActiveCardIndex] = useState<number | null>(
		section.cards.length > 0 ? 0 : null
	);

	// カードの更新を処理
	const updateCard = (
		index: number,
		key: keyof Card,
		value: string | null
	) => {
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

	// カードを上に移動
	const moveCardUp = (index: number) => {
		if (index <= 0) return;
		const updatedCards = [...section.cards];
		[updatedCards[index - 1], updatedCards[index]] = [
			updatedCards[index],
			updatedCards[index - 1],
		];
		onUpdate({
			...section,
			cards: updatedCards,
		});
		setActiveCardIndex(index - 1);
	};

	// カードを下に移動
	const moveCardDown = (index: number) => {
		if (index >= section.cards.length - 1) return;
		const updatedCards = [...section.cards];
		[updatedCards[index], updatedCards[index + 1]] = [
			updatedCards[index + 1],
			updatedCards[index],
		];
		onUpdate({
			...section,
			cards: updatedCards,
		});
		setActiveCardIndex(index + 1);
	};

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
		<div className="space-y-6">
			<UICard className="p-4">
				<h3 className="text-lg font-medium mb-4">
					カードセクション設定
				</h3>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="cards-name">セクション名</Label>
						<Input
							id="cards-name"
							value={section.name || ""}
							onChange={handleNameChange}
							placeholder="例: カード"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="cards-class">クラス名</Label>
						<Input
							id="cards-class"
							value={section.class}
							onChange={handleClassNameChange}
							placeholder="例: cards-section py-8"
						/>
					</div>
					<BackgroundImageUpload
						initialImage={section.bgImage}
						onImageChange={handleBgImageChange}
						label="背景画像"
					/>
					<div className="border-t pt-4 mt-4">
						<div className="flex justify-between items-center mb-4">
							<h4 className="text-md font-medium">
								カード ({section.cards.length})
							</h4>
							<Button size="sm" onClick={addCard}>
								<Plus className="h-4 w-4 mr-1" />
								カードを追加
							</Button>
						</div>
						{section.cards.length === 0 ? (
							<div className="text-center p-8 border border-dashed rounded">
								<p className="text-gray-500 mb-4">
									カードがありません
								</p>
								<Button onClick={addCard}>
									<Plus className="h-4 w-4 mr-1" />
									最初のカードを追加
								</Button>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-6 md:grid-cols-12">
								{/* カードリスト */}
								<div className="md:col-span-3">
									<div className="space-y-2">
										{section.cards.map((card, index) => (
											<div
												key={index}
												className={`p-2 border rounded flex justify-between cursor-pointer ${
													activeCardIndex === index
														? "border-blue-500 bg-blue-50"
														: ""
												}`}
												onClick={() =>
													setActiveCardIndex(index)
												}
											>
												<span className="truncate">
													カード {index + 1}
												</span>
												<div className="flex items-center space-x-1">
													<Button
														variant="ghost"
														size="icon"
														className="h-5 w-5"
														onClick={(e) => {
															e.stopPropagation();
															moveCardUp(index);
														}}
														disabled={index === 0}
													>
														<MoveUp className="h-3 w-3" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-5 w-5"
														onClick={(e) => {
															e.stopPropagation();
															moveCardDown(index);
														}}
														disabled={
															index ===
															section.cards
																.length -
																1
														}
													>
														<MoveDown className="h-3 w-3" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-5 w-5 text-red-500"
														onClick={(e) => {
															e.stopPropagation();
															removeCard(index);
														}}
													>
														<Trash className="h-3 w-3" />
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
								{/* カード編集 */}
								{activeCardIndex !== null && (
									<div className="md:col-span-9">
										<UICard className="p-4">
											<h4 className="text-md font-medium mb-4">
												カード {activeCardIndex + 1}{" "}
												を編集
											</h4>
											<div className="space-y-4">
												<ImageUpload
													initialImage={
														section.cards[
															activeCardIndex
														].image
													}
													onImageChange={(url) =>
														updateCard(
															activeCardIndex,
															"image",
															url
														)
													}
													label="カード画像"
												/>
												<div className="space-y-2">
													<Label>カード内容</Label>
													<RichTextEditor
														content={
															section.cards[
																activeCardIndex
															].html
														}
														onChange={(content) =>
															updateCard(
																activeCardIndex,
																"html",
																content
															)
														}
														placeholder="ここにカードのHTMLを入力..."
													/>
												</div>
											</div>
										</UICard>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</UICard>
		</div>
	);
}
