"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, X } from "lucide-react";
import { uploadAndOptimizeImage } from "@/lib/imageUtils";
import { ImageGalleryModal } from "./ImageGalleryModal";
import Image from "next/image";

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
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // 初期画像が変更されたら内部状態を更新
  useEffect(() => {
    if (initialImage !== imageUrl) {
      setImageUrl(initialImage || null);
    }
  }, [initialImage, imageUrl]);

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
        throw new Error("画像のアップロードに失敗しました");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
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
    <div className="flex flex-wrap justify-between space-y-4">
      <Label className="w-full">{label}</Label>

      {/* 画像アップロード */}
      <div className="">
        <Label
          htmlFor="bg-image-upload"
          className="flex w-full cursor-pointer items-center gap-2 rounded border border-dashed px-4 py-2 hover:bg-gray-50"
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
          className="mt-1 flex items-center gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          アップロード済み画像から選択
        </Button>

        {isUploading && <span className="text-sm">アップロード中...</span>}
      </div>

      {/* 画像プレビュー */}
      {imageUrl && (
        <div className="relative h-[200px] w-1/2">
          <div className="relative h-full w-full overflow-hidden ">
            <Image
              src={imageUrl}
              alt="Background image"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={removeImage}
              aria-label="背景画像を削除"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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
