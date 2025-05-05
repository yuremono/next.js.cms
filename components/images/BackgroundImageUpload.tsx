"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ImageIcon, Upload, X } from "lucide-react";
import { uploadAndOptimizeImage } from "@/lib/imageUtils";
import { ImageGalleryModal } from "./ImageGalleryModal";

interface BackgroundImageUploadProps {
	initialImage?: string;
	onImageChange: (url: string | null) => void;
	label?: string;
}

export function BackgroundImageUpload({
	initialImage,
	onImageChange,
	label = "背景画像",
}: BackgroundImageUploadProps) {
	const [imageUrl, setImageUrl] = useState<string | null>(
		initialImage || null
	);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	// 画像をアップロード
	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// 画像ファイルか確認
		if (!file.type.startsWith("image/")) {
			setError("画像ファイルを選択してください");
			return;
		}

		setIsUploading(true);
		setError(null);

		try {
			// 画像をアップロードして最適化
			const optimizedImageUrl = await uploadAndOptimizeImage(file);

			if (optimizedImageUrl) {
				setImageUrl(optimizedImageUrl);
				onImageChange(optimizedImageUrl);
			} else {
				throw new Error("背景画像のアップロードに失敗しました");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "エラーが発生しました"
			);
		} finally {
			setIsUploading(false);
			// 入力フィールドをリセット
			e.target.value = "";
		}
	};

	// ギャラリーから画像を選択
	const handleSelectFromGallery = (url: string) => {
		setImageUrl(url);
		onImageChange(url);
	};

	// 画像を削除
	const removeImage = () => {
		setImageUrl(null);
		onImageChange(null);
	};

	return (
		<div className="space-y-4">
			<Label>{label}</Label>

			{/* 背景画像プレビュー - スタイルを変更 */}
			{imageUrl && (
				<div className="relative mb-4">
					<div
						className="w-full h-32 rounded border bg-cover bg-center"
						style={{ backgroundImage: `url(${imageUrl})` }}
					/>
					<Button
						variant="destructive"
						size="icon"
						className="absolute top-2 right-2"
						onClick={removeImage}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			)}

			{/* 背景画像アップロード */}
			<div className="flex flex-wrap gap-2">
				<Label
					htmlFor="bg-image-upload"
					className="flex cursor-pointer items-center gap-2 rounded border border-dashed px-4 py-2 hover:bg-gray-50"
				>
					<Upload className="h-4 w-4" />
					<span>ファイルをアップロード</span>
					<Input
						id="bg-image-upload"
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleFileUpload}
						disabled={isUploading}
					/>
				</Label>

				<Button
					variant="outline"
					type="button"
					onClick={() => setIsGalleryOpen(true)}
					className="flex items-center gap-2"
				>
					<ImageIcon className="h-4 w-4" />
					アップロード済み画像から選択
				</Button>

				{isUploading && (
					<span className="text-sm">アップロード中...</span>
				)}
			</div>

			{error && <p className="text-sm text-red-500">{error}</p>}

			{/* 画像ギャラリーモーダル */}
			<ImageGalleryModal
				isOpen={isGalleryOpen}
				onClose={() => setIsGalleryOpen(false)}
				onSelectImage={handleSelectFromGallery}
			/>
		</div>
	);
}
