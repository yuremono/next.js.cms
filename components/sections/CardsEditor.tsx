"use client";

import { useState, useEffect } from "react";
import { RichTextEditor } from "../ui/editor";
import { ImageUpload } from "../ImageUpload";
import { BackgroundImageUpload } from "../BackgroundImageUpload";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card as UICard } from "../ui/card";
import { Button } from "../ui/button";
import { CardsSection, Card } from "@/types";
import { Plus, Trash, MoveUp, MoveDown } from "lucide-react";

interface CardsEditorProps {
	section: CardsSection;
	onUpdate: (section: CardsSection) => void;
}

export function CardsEditor({ section, onUpdate }: CardsEditorProps) {
	const [activeCardIndex, setActiveCardIndex] = useState<number | null>(
		section.cards.length > 0 ? 0 : null
	);
	const [className, setClassName] = useState(section.class);
	const [backgroundImage, setBackgroundImage] = useState<string | null>(
		section.bgImage || null
	);
	const [cards, setCards] = useState<Card[]>(section.cards);

	// セクション全体を更新
	const updateSection = () => {
		onUpdate({
			...section,
			class: className,
			bgImage: backgroundImage || undefined,
			cards: cards,
		});
	};

	// 値が変更されたらセクションを更新
	useEffect(() => {
		updateSection();
	}, [className, backgroundImage, cards]);

	// カードの更新を処理
	const updateCard = (index: number, key: keyof Card, value: any) => {
		const updatedCards = [...cards];
		updatedCards[index] = {
			...updatedCards[index],
			[key]: value,
		};
		setCards(updatedCards);
	};

	// 新しいカードを追加
	const addCard = () => {
		const newCard: Card = {
			image: "",
			html: "<h3>新しいカード</h3><p>ここにカードの内容を入力してください。</p>",
		};
		const updatedCards = [...cards, newCard];
		setCards(updatedCards);
		setActiveCardIndex(updatedCards.length - 1);
	};

	// カードを削除
	const removeCard = (index: number) => {
		const updatedCards = cards.filter((_, i) => i !== index);
		setCards(updatedCards);

		if (activeCardIndex === index) {
			setActiveCardIndex(updatedCards.length > 0 ? 0 : null);
		} else if (activeCardIndex !== null && index < activeCardIndex) {
			setActiveCardIndex(activeCardIndex - 1);
		}
	};

	// カードを上に移動
	const moveCardUp = (index: number) => {
		if (index <= 0) return;
		const updatedCards = [...cards];
		[updatedCards[index - 1], updatedCards[index]] = [
			updatedCards[index],
			updatedCards[index - 1],
		];
		setCards(updatedCards);
		setActiveCardIndex(index - 1);
	};

	// カードを下に移動
	const moveCardDown = (index: number) => {
		if (index >= cards.length - 1) return;
		const updatedCards = [...cards];
		[updatedCards[index], updatedCards[index + 1]] = [
			updatedCards[index + 1],
			updatedCards[index],
		];
		setCards(updatedCards);
		setActiveCardIndex(index + 1);
	};

	return (
		<div className="space-y-6">
			<UICard className="p-4">
				<h3 className="text-lg font-medium mb-4">
					カードセクション設定
				</h3>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="cards-class">クラス名</Label>
						<Input
							id="cards-class"
							value={className}
							onChange={(e) => setClassName(e.target.value)}
							placeholder="例: cards-section py-8"
						/>
					</div>

					<BackgroundImageUpload
						initialImage={backgroundImage || undefined}
						onImageChange={setBackgroundImage}
						label="背景画像"
					/>

					<div className="border-t pt-4 mt-4">
						<div className="flex justify-between items-center mb-4">
							<h4 className="text-md font-medium">
								カード ({cards.length})
							</h4>
							<Button size="sm" onClick={addCard}>
								<Plus className="h-4 w-4 mr-1" />
								カードを追加
							</Button>
						</div>

						{cards.length === 0 ? (
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
										{cards.map((card, index) => (
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
															cards.length - 1
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
														cards[activeCardIndex]
															.image
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
															cards[
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
