"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ImageComparisonSlider from "../../../components/photos/ImageComparisonSlider";
import { supabase } from "../../../lib/supabase";
import type { Photo } from "../../../types";

export default function PhotoPage() {
  const { id } = useParams() as { id: string };
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    async function fetchPhoto() {
      try {
        const { data, error } = await supabase
          .from("photos")
          .select("*")
          .or(`id.eq.${id},slug.eq.${id}`)
          .single();

        if (error) {
          console.error("Error fetching photo:", error);
          setPhoto(null);
        } else if (data) {
          setPhoto({
            ...data,
            aspectRatio: data.aspect_ratio,
            objectPosition: data.object_position,
            metadata: data.metadata,
          } as Photo);
        }
      } catch (err) {
        console.error("Error:", err);
        setPhoto(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPhoto();
  }, [id]);

  useEffect(() => {
    if (photo?.images.artStyles && photo.images.artStyles.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const styleParam = urlParams.get("style");
      if (styleParam && photo.images.artStyles.some(s => s.id === styleParam)) {
        setSelectedStyleId(styleParam);
      } else if (!selectedStyleId) {
        setSelectedStyleId(photo.images.artStyles[0].id);
      }
    }
  }, [photo, selectedStyleId]);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyleId(styleId);
    const url = new URL(window.location.href);
    url.searchParams.set("style", styleId);
    window.history.replaceState({}, "", url.toString());
  };

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-white p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Photo Not Found</h1>
        <p className="text-gray-500">The photo you are looking for does not exist.</p>
        <Link
          href="/photos"
          className="text-sm font-medium text-black underline underline-offset-4 hover:text-gray-600"
        >
          Back to Gallery
        </Link>
      </div>
    );
  }

  const currentStyle = photo.images.artStyles?.find(s => s.id === selectedStyleId);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      <main className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back to Gallery Link */}
        <div className="mb-8">
          <Link
            href="/photos"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Gallery
          </Link>
        </div>

        <header className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            {photo.title}
          </h1>
          {photo.description && (
            <p className="text-base text-gray-600 leading-relaxed mb-4 max-w-2xl mx-auto">
              {photo.description}
            </p>
          )}

          {/* Metadata & Actions */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-medium uppercase tracking-widest text-gray-400">
              <span>{photo.date}</span>
              {photo.location && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                  <span>{photo.location}</span>
                </>
              )}
              {photo.metadata?.camera && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                  <span>{photo.metadata.camera}</span>
                </>
              )}
              {photo.metadata?.lens && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                  <span>{photo.metadata.lens}</span>
                </>
              )}
              {photo.metadata?.film && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                  <span>{photo.metadata.film}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={photo.images.original}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-medium rounded-full transition-colors"
              >
                Download Original
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="px-3 py-1.5 bg-black text-white hover:bg-gray-800 text-xs font-medium rounded-full transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        </header>

        <div className="mb-16">
          <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100 bg-gray-50" style={{ maxHeight: '70vh' }}>
            {photo.images.original && currentStyle ? (
              <ImageComparisonSlider
                imageBefore={photo.images.original}
                imageAfter={currentStyle.imagePath}
                altBefore="Original"
                altAfter={currentStyle.name}
                aspectRatio={photo.aspectRatio || "16 / 9"}
                objectPosition={photo.objectPosition}
                objectPositionAfter={currentStyle.objectPosition}
                videoSrc={photo.images.video}
              />
            ) : (
              <div className="aspect-video flex items-center justify-center text-gray-400">
                Image data missing
              </div>
            )}
          </div>
        </div>

        {photo.images.artStyles && photo.images.artStyles.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold">Choose a Style</h2>
              <span className="text-sm text-gray-500">
                {photo.images.artStyles.length} Variations
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {photo.images.artStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  className={`group text-left transition-all duration-300 ${selectedStyleId === style.id ? "opacity-100 scale-100" : "opacity-70 hover:opacity-100 hover:scale-[1.02]"
                    }`}
                >
                  <div className={`relative aspect-square rounded-lg overflow-hidden mb-3 border-2 transition-colors ${selectedStyleId === style.id ? "border-black shadow-lg" : "border-transparent shadow-sm"
                    }`}>
                    <Image
                      src={style.imagePath}
                      alt={style.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  </div>
                  <h3 className={`font-medium text-sm ${selectedStyleId === style.id ? "text-black" : "text-gray-600"}`}>
                    {style.name}
                  </h3>
                  {style.prompt && (
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                      {style.prompt}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
