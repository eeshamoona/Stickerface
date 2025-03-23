// src/components/StickerSheet.tsx
import type { Sticker } from "../types";
import { stickers } from "../lib/data";
import StickerComponent from "./Sticker";

export default function StickerSheet() {
  return (
    <div className="sticker-sheet p-6 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
        Stickerface
      </h1>
      <p className="text-center mb-8 text-slate-600">
        Tap a sticker to activate its magic!
      </p>

      <div className="sticker-grid grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="sticker-wrapper flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
            title="Click to view sticker details"
          >
            <StickerComponent sticker={sticker} />
            <span className="sticker-name text-sm font-medium mt-2 text-slate-700">
              {sticker.name}
            </span>
            <span className="text-xs text-blue-500 mt-1">Click to view</span>
          </div>
        ))}
      </div>
    </div>
  );
}
