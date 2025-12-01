// src/app/photos/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { getPhotos } from "../../lib/storage";
import { Photo } from "../../types";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    getPhotos().then((data) => {
      setPhotos(data);
      setLoading(false);
    });

    // Real-time subscription
    const channel = supabase
      .channel("photos-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "photos" },
        (payload) => {
          setPhotos((prev) => [payload.new as Photo, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      {/* Navigation / Header */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif tracking-tight mb-2">
            Gallery
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            A collection of moments reimagined through art.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((photo) => (
              <Link
                key={photo.id}
                href={`/photos/${photo.slug || photo.id}`}
                className="group block break-inside-avoid mb-6"
              >
                <article className="flex flex-col gap-3">
                  <div
                    className="relative overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-md"
                    style={{
                      aspectRatio: photo.aspectRatio,
                    }}
                  >
                    <Image
                      src={photo.images.original}
                      alt={photo.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ objectPosition: photo.objectPosition || '50% 50%' }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
                  </div>

                  <div className="space-y-0.5">
                    <h2 className="text-lg font-bold font-serif leading-snug group-hover:underline decoration-1 underline-offset-4">
                      {photo.title}
                    </h2>
                    <div className="flex items-center text-xs text-gray-400 font-medium uppercase tracking-wider gap-2">
                      <span>{photo.date}</span>
                      {photo.images.artStyles && photo.images.artStyles.length > 0 && (
                        <>
                          <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                          <span>
                            {photo.images.artStyles.length}{" "}
                            {photo.images.artStyles.length === 1 ? "Style" : "Styles"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {!loading && photos.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">No photos found.</p>
            <Link
              href="/photos/manage"
              className="text-black font-medium underline underline-offset-4 hover:text-gray-600"
            >
              Create your first photo
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

