// src/app/photos/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { photos } from "../../lib/photos";

export default function PhotosPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Photo Gallery</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group">
              <Link href={`/photos/${photo.id}`} className="block">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: photo.aspectRatio || "16 / 9" }}
                  >
                    <Image
                      src={
                        photo.type === "comparison"
                          ? photo.images.after!
                          : photo.type === "gallery"
                          ? photo.images.gallery![0]
                          : photo.type === "art-styles"
                          ? photo.images.original
                          : photo.images.main!
                      }
                      alt={photo.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-1 group-hover:text-blue-600">
                      {photo.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {photo.description}
                    </p>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>{photo.date}</span>
                      {photo.type === "comparison" && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Before & After
                        </span>
                      )}
                      {photo.type === "art-styles" && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          Art Styles
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Art style quick links */}
              {photo.type === "art-styles" && photo.images.artStyles && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {photo.images.artStyles.map((style) => (
                    <Link
                      key={style.id}
                      href={`/photos/${photo.id}?style=${style.id}`}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                    >
                      {style.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
