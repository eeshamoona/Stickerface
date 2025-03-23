// src/components/Sticker.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { animations } from "../lib/animations";
import type { Sticker } from "../types";

interface StickerProps {
  sticker: Sticker;
  isSheet?: boolean;
}

export default function StickerComponent({ sticker, isSheet = true }: StickerProps) {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    if (!isSheet) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
  };

  const stickerStyle = {
    backgroundColor: sticker.color,
    transform: pressed ? "scale(0.95)" : "scale(1)",
    transition: "transform 0.2s ease-out",
    ...(sticker.animation && animations[sticker.animation]),
  };

  const content = (
    <div
      className="sticker-container relative rounded-full w-24 h-24 flex items-center justify-center shadow-lg cursor-pointer overflow-hidden hover:shadow-xl"
      style={stickerStyle}
      onMouseDown={handlePress}
      onTouchStart={handlePress}
      aria-label={`View ${sticker.name} sticker details`}
    >
      <div className="sticker-content z-10 flex flex-col items-center justify-center p-2">
        <div className="w-12 h-12 flex items-center justify-center">
          <img
            src={sticker.imageSrc}
            alt={sticker.name}
            className="w-full h-full object-contain"
            style={{ filter: "invert(1)", maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      </div>
      <div
        className="sticker-shine absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)",
        }}
      />
      {/* Sticker edge texture */}
      <div
        className="sticker-edge absolute top-0 left-0 w-full h-full rounded-full"
        style={{
          border: "2px dashed rgba(255,255,255,0.2)",
        }}
      />
    </div>
  );

  if (isSheet) {
    return (
      <Link href={`/sticker/${sticker.id}`} className="sticker-link m-2">
        {content}
      </Link>
    );
  }

  return content;
}
