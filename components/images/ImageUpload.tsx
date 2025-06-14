"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, X } from "lucide-react";
import { uploadAndOptimizeImage } from "@/lib/imageUtils";
import { ImageGalleryModal } from "./ImageGalleryModal";
import Image from "next/image";

interface ImageUploadProps {
  initialImage?: string;
  initialClass?: string;
  onImageChange: (url: string | null) => void;
  onClassChange?: (className: string) => void;
  label?: string;
}

export function ImageUpload({
  initialImage,
  initialClass = "",
  onImageChange,
  onClassChange,
  label = "画像",
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [imageClass, setImageClass] = useState(initialClass);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // 初期画像が変更されたら内部状態を更新
  useEffect(() => {
    if (initialImage !== imageUrl) {
      setImageUrl(initialImage || null);
    }
  }, [initialImage, imageUrl]);

  useEffect(() => {
    if (initialClass !== imageClass) {
      setImageClass(initialClass);
    }
  }, [initialClass, imageClass]);

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

  // 画像クラスを変更
  const handleClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newClass = e.target.value;
    setImageClass(newClass);
    if (onClassChange) {
      onClassChange(newClass);
    }
  };

  return (
    <div className="flex flex-wrap justify-between space-y-4">
      <div className="flex w-full gap-4 space-y-2">
        <Label className="">{label}</Label>
        <Input
          className="flex-1"
          placeholder="例: object-cover rounded"
          value={imageClass}
          onChange={handleClassChange}
        />
      </div>

      {/* 画像アップロード */}
      <div className="">
        <Label
          htmlFor="image-upload"
          className="flex w-full cursor-pointer items-center gap-4 rounded border border-dashed px-4 py-2 hover:bg-gray-50"
        >
          <Upload className="h-4 w-4" />
          <span>ファイルをアップロード</span>
          <Input
            id="image-upload"
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
          className="mt-1 flex items-center gap-4"
        >
          <ImageIcon className="h-4 w-4" />
          アップロード済み画像から選択
        </Button>

        {isUploading && <span className="text-sm">アップロード中...</span>}
      </div>

      {/* 画像プレビュー */}
      {imageUrl && (
        <div className="relative h-[200px] w-1/2">
          <Image
            src={imageUrl}
            alt="Uploaded image"
            fill
            className="object-contain"
            unoptimized={
              imageUrl.includes("_local") || imageUrl.startsWith("data:")
            }
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={removeImage}
            aria-label="画像を削除"
          >
            <X className="h-4 w-4" />
          </Button>
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
