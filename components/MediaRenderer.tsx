"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getFileType } from "@/lib/mediaUtils";

interface MediaRendererProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  fill?: boolean;
}

export function MediaRenderer({
  src,
  alt,
  className = "object-cover",
  style,
  priority = false,
  fill = false,
}: MediaRendererProps) {
  const [isVideo, setIsVideo] = useState<boolean | null>(null);

  useEffect(() => {
    // クライアントサイドでファイルタイプを判別
    const fileType = getFileType(src);
    setIsVideo(fileType === "video");
  }, [src]);

  // ハイドレーション前（SSR時）は何も判別せず、デフォルト表示
  if (isVideo === null) {
    // SSR時はdivプレースホルダーで表示し、ハイドレーション後に適切なコンポーネントに置き換える
    return (
      <div 
        className={className}
        style={style}
        suppressHydrationWarning
      />
    );
  }

  // クライアントサイドで動画判定された場合
  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        controls
        preload="metadata"
        style={style}
        suppressHydrationWarning
      >
        お使いのブラウザは動画をサポートしていません。
      </video>
    );
  }

  // 画像の場合
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      style={style}
      priority={priority}
      unoptimized={src.includes("_local") || src.startsWith("data:")}
      suppressHydrationWarning
    />
  );
}
