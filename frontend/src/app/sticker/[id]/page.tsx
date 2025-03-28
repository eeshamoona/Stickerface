// src/app/sticker/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCharacterConfig, getSticker } from "../../../lib/data";

// Import individual sticker components
import DoNotPressButton from "../../../components/stickers/DoNotPressButton";
import FortuneSticker from "../../../components/stickers/FortuneSticker";
import PerfectDayToRememberSticker from "../../../components/stickers/PerfectDayToRememberSticker";
import SpellSticker from "../../../components/stickers/SpellSticker";
import PurrfectTiming from "../../../components/stickers/purrfectTiming";

export default function StickerPage() {
  // const router = useRouter(); // Removed unused variable
  const searchParams = useSearchParams();
  const slug = searchParams.get("friend");
  const character = getCharacterConfig(slug ?? "capybara");
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
      case "spell":
        return <SpellSticker />;
      case "purrfect-timing":
        return <PurrfectTiming />;
      case "perfect-day":
        return <PerfectDayToRememberSticker character={character} />;
      case "button":
        return <DoNotPressButton />;
      default:
        return <div>Coming soon!</div>;
    }
  };

  return (
    <div
      className="sticker-page flex flex-col items-center h-screen p-4"
      style={{ backgroundColor: `${sticker.color}80` }}
    >
      <div className="sticker-content-container w-full max-w-md flex-grow flex flex-col justify-center p-4 bg-white rounded-2xl shadow-lg">
        {renderStickerContent()}
      </div>
    </div>
  );
}
