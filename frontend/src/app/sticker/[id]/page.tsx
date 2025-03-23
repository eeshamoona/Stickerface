// src/app/sticker/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSticker } from "../../../lib/data";

// Import individual sticker components
import FortuneSticker from "../../../components/stickers/FortuneSticker";
import PetSticker from "../../../components/stickers/PetSticker";
import SpellSticker from "../../../components/stickers/SpellSticker";

export default function StickerPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const sticker = getSticker(id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!sticker) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
        <p className="text-xl text-slate-700 mb-4">Sticker not found</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Back to sticker sheet
        </Link>
      </div>
    );
  }

  const renderStickerContent = () => {
    switch (sticker.type) {
      case "fortune":
        return <FortuneSticker />;
      case "pet":
        return <PetSticker />;
      case "spell":
        return <SpellSticker />;
      case "weather":
      case "music":
      case "game":
      case "art":
      default:
        return <div>Coming soon!</div>;
    }
  };

  return (
    <div
      className="sticker-page flex flex-col items-center min-h-screen p-4"
      style={{ backgroundColor: `${sticker.color}30` }} // Light version of sticker color
    >
      <div className="mb-4 flex items-center w-full">
        <button
          onClick={() => router.push("/")}
          className="text-slate-700 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="ml-2">Back</span>
        </button>
      </div>

      <div className="sticker-content-container w-full max-w-md p-4 bg-white rounded-2xl shadow-lg mb-6">
        {renderStickerContent()}
      </div>
    </div>
  );
}
