"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, Loader2, Trash2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";

// 画像情報の型定義
interface ImageInfo {
	name: string;
	url: string;
	size: number;
	created: string;
}

interface ImageGalleryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectImage: (url: string) => void;
}

export function ImageGalleryModal({
	isOpen,
	onClose,
	onSelectImage,
}: ImageGalleryModalProps) {
	const [images, setImages] = useState<ImageInfo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [hoverIndex, setHoverIndex] = useState<number | null>(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [imageToDelete, setImageToDelete] = useState<ImageInfo | null>(null);
	const [deleting, setDeleting] = useState(false);

	// 画像一覧を取得
	const fetchImages = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetch("/api/images");
			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			setImages(data.images || []);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "画像の取得に失敗しました"
			);
		} finally {
			setLoading(false);
		}
	};

	// 画像を削除
	const deleteImage = async (image: ImageInfo) => {
		try {
			setDeleting(true);
			const response = await fetch("/api/images", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ filename: image.name }),
			});

			const data = await response.json();
			if (data.error) {
				throw new Error(data.error);
			}

			// 成功したら一覧を更新
			await fetchImages();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "画像の削除に失敗しました"
			);
		} finally {
			setDeleting(false);
			setDeleteConfirmOpen(false);
			setImageToDelete(null);
		}
	};

	// モーダルが開かれたら画像一覧を取得
	useEffect(() => {
		if (isOpen) {
			fetchImages();
		}
	}, [isOpen]);

	// 削除ダイアログを表示
	const handleDeleteClick = (e: React.MouseEvent, image: ImageInfo) => {
		e.stopPropagation();
		setImageToDelete(image);
		setDeleteConfirmOpen(true);
	};

	// 画像を選択
	const handleSelectImage = (image: ImageInfo) => {
		onSelectImage(image.url);
		onClose();
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>アップロード済み画像</DialogTitle>
					</DialogHeader>

					{loading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
						</div>
					) : error ? (
						<div className="py-8 text-center text-red-500">
							{error}
						</div>
					) : images.length === 0 ? (
						<div className="py-8 text-center text-gray-500">
							アップロード済みの画像がありません
						</div>
					) : (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
							{images.map((image, index) => (
								<div
									key={image.name}
									className="group relative cursor-pointer rounded border"
									onClick={() => handleSelectImage(image)}
									onMouseEnter={() => setHoverIndex(index)}
									onMouseLeave={() => setHoverIndex(null)}
								>
									<div className="relative aspect-square">
										<img
											src={image.url}
											alt={image.name}
											className="h-full w-full rounded object-cover"
										/>

										{/* オーバーレイとボタン */}
										{hoverIndex === index && (
											<div className="absolute inset-0 flex items-center justify-center bg-black/40">
												<div className="flex gap-2">
													<Button
														size="icon"
														variant="secondary"
														onClick={() =>
															handleSelectImage(
																image
															)
														}
													>
														<Check className="h-4 w-4" />
													</Button>
													<Button
														size="icon"
														variant="destructive"
														onClick={(e) =>
															handleDeleteClick(
																e,
																image
															)
														}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* 削除確認ダイアログ */}
			<AlertDialog
				open={deleteConfirmOpen}
				onOpenChange={setDeleteConfirmOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>画像の削除</AlertDialogTitle>
						<AlertDialogDescription>
							本当にこの画像を削除しますか？この操作は元に戻せません。
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>キャンセル</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								imageToDelete && deleteImage(imageToDelete)
							}
							disabled={deleting}
						>
							{deleting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									削除中...
								</>
							) : (
								"削除する"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
