"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isDragOver, setIsDragOver] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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
  const handleFileUpload = async (file: File) => {
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
    }
  };

  // ファイル入力からのアップロード
  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
    // 入力フィールドをリセット
    e.target.value = "";
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

  // ドラッグ&ドロップイベントハンドラー
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
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
        <div
          ref={dropZoneRef}
          className={`flex w-full cursor-pointer items-center gap-4 rounded border border-dashed px-4 py-2 transition-colors ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-4 w-4" />
          <span>
            {isDragOver
              ? "ここにドロップしてください"
              : "ファイルをアップロード"}
          </span>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isUploading}
          />
          <Label htmlFor="image-upload" className="cursor-pointer">
            クリックして選択
          </Label>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={() => setIsGalleryOpen(true)}
          className="mt-1 flex items-center gap-4"
        >
          <ImageIcon className="h-4 w-4" />
          アップロード済み画像から選択
        </Button>

        {isUploading && <span className=" ">アップロード中...</span>}
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

      {error && <p className="  text-red-500">{error}</p>}

      {/* 画像ギャラリーモーダル */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={handleSelectFromGallery}
      />
    </div>
  );
}
