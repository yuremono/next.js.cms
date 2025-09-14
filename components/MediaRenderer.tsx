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
  const [isMounted, setIsMounted] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // クライアントサイドでファイルタイプを判別
    const fileType = getFileType(src);
    setIsVideo(fileType === "video");
  }, [src]);

  // SSR時は常に画像として扱い、クライアントサイドでのみ動画判定
  if (!isMounted) {
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

  // クライアントサイドで動画判定された場合
  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        controls
        preload="metadata"
        style={style}
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
    />
  );
}
