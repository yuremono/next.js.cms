"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { uploadAndOptimizeImage } from "@/lib/imageUtils";
import { Copy, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageData {
	name: string;
	url: string;
	size: number;
	created: string;
}

export function ImageGallery() {
	const [images, setImages] = useState<ImageData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 画像一覧を取得
	const fetchImages = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/images");

			if (!response.ok) {
				throw new Error("画像の取得に失敗しました");
			}

			const data = await response.json();
			setImages(data.images || []);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "エラーが発生しました"
			);
			console.error("画像取得エラー:", err);
		} finally {
			setIsLoading(false);
		}
	};

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
				// 新しい画像をリストに追加 (一時的な表示用)
				const newImage: ImageData = {
					name: file.name,
					url: optimizedImageUrl,
					size: file.size,
					created: new Date().toISOString(),
				};

				setImages((prev) => [newImage, ...prev]);
				toast.success("画像がアップロードされました");
			} else {
				throw new Error("画像のアップロードに失敗しました");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "エラーが発生しました"
			);
		} finally {
			setIsUploading(false);
			// 入力フィールドをリセット
			e.target.value = "";

			// 画像リストを更新
			fetchImages();
		}
	};

	// クリップボードにURLをコピー
	const copyToClipboard = (url: string) => {
    // Clipboard APIが利用可能かチェック
    if (!navigator.clipboard) {
      toast.error("このブラウザではクリップボード機能がサポートされていません");
      return;
    }

    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("画像URLをコピーしました");
      })
      .catch((error) => {
        console.warn("クリップボードコピーに失敗:", error);
        toast.error("コピーに失敗しました");
      });
  };

	// 初期データ読み込み
	useEffect(() => {
		fetchImages();
	}, []);

	  return (
      <div className="flex h-full flex-col space-y-6">
        <Card className="flex flex-1 flex-col rounded-sm p-4">
          <h3 className="mb-4 text-lg font-medium">画像一覧</h3>

          <div className="space-y-4">
            {/* アップロードフォーム */}
            <div>
              <Label
                htmlFor="gallery-image-upload"
                className="mb-2 block w-full"
              >
                新しい画像をアップロード
              </Label>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="gallery-image-upload"
                  className="flex cursor-pointer items-center gap-2 rounded border border-dashed px-4 py-2 hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>画像を選択</span>
                  <Input
                    id="gallery-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </Label>
                {isUploading && (
                  <span className="text-sm">アップロード中...</span>
                )}
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* 画像ギャラリー */}
            <div className="mt-6">
              <h4 className="text-md mb-2 font-medium">
                アップロード済み画像 ({images.length})
              </h4>

              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
                  <p className="mt-2">画像を読み込んでいます...</p>
                </div>
              ) : images.length === 0 ? (
                <div className="rounded border border-dashed py-8 text-center">
                  <p className="text-muted-foreground">
                    アップロードされた画像はありません
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {images.map((image, index) => (
                    <div key={index} className="group relative rounded border">
                      <div className="relative h-[200px] w-full">
                        <Image
                          src={image.url}
                          alt={image.name}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all group-hover:bg-opacity-50 group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(image.url)}
                          className="bg-white"
                        >
                          <Copy className="mr-1 h-4 w-4" />
                          URLをコピー
                        </Button>
                      </div>
                      <div className="truncate p-2 text-xs">{image.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
}
