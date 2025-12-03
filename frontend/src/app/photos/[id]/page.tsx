"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ImageComparisonSlider from "../../../components/photos/ImageComparisonSlider";
import { supabase } from "../../../lib/supabase";
import type { Photo } from "../../../types";

import JSZip from "jszip";

export default function PhotoPage() {
  const { id } = useParams() as { id: string };
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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

  const handleDownloadAll = async () => {
    if (!photo) return;
    setDownloading(true);

    try {
      const zip = new JSZip();

      // Add original
      const originalBlob = await fetch(photo.images.original).then(r => r.blob());
      const originalExt = photo.images.original.split('.').pop() || 'jpg';
      zip.file(`original.${originalExt}`, originalBlob);

      // Add styles
      if (photo.images.artStyles) {
        await Promise.all(photo.images.artStyles.map(async (style) => {
          const styleBlob = await fetch(style.imagePath).then(r => r.blob());
          const styleExt = style.imagePath.split('.').pop() || 'jpg';
          const safeName = style.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          zip.file(`${safeName}.${styleExt}`, styleBlob);
        }));
      }

      // Generate and download
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${photo.slug || photo.id}-assets.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading assets:", error);
      alert("Failed to download assets. Please try again.");
    } finally {
      setDownloading(false);
    }
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
      <main className="pt-8 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Back to Gallery Link */}
        <div className="mb-8">
          <Link
            href="/photos"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Gallery
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">

          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{photo.title}</h1>
          </div>

          {/* Comparison Slider */}
          <div className="mb-6">
            <div className="max-w-4xl mx-auto max-h-[85vh] rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
              {photo.images.original && currentStyle ? (
                <ImageComparisonSlider
                  imageBefore={photo.images.original}
                  imageAfter={currentStyle.imagePath}
                  altBefore="Original Photo"
                  altAfter={currentStyle.name}
                  aspectRatio={photo.aspectRatio || "16 / 9"}
                  objectPosition={photo.objectPosition}
                  objectPositionAfter={currentStyle.objectPosition}
                  videoSrc={photo.images.video}
                  isVideoPlaying={isVideoPlaying}
                  onVideoPlayingChange={setIsVideoPlaying}
                />
              ) : (
                <div className="aspect-video flex items-center justify-center text-gray-400">
                  Image not available
                </div>
              )}
            </div>

            {/* Video Controls and Slider Hint */}
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                Drag slider to compare
              </p>

              {photo.images.video && (
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                  title={isVideoPlaying ? "Pause Video" : "Play Video"}
                >
                  {isVideoPlaying ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                      </svg>
                      Stop Video
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                      Play Video
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Date & Location */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-10">
            <span>{new Date(photo.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {photo.location && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(photo.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600 hover:underline transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.45-.96 2.337-1.774 1.775-1.626 3.794-4.02 3.794-6.577 0-3.866-3.134-7-7-7s-7 3.134-7 7c0 2.557 2.019 4.951 3.794 6.577.887.814 1.717 1.39 2.337 1.774.311.192.571.337.757.433a5.744 5.744 0 00.299.148l.006.003.002.001zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  {photo.location}
                </a>
              </>
            )}
          </div>

          {/* Art Styles Grid */}
          <div className="space-y-6 mb-10">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">Art Styles</h2>
              <span className="text-xs text-gray-500">{photo.images.artStyles.length} styles</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photo.images.artStyles.map((style, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col gap-2 cursor-pointer"
                  onClick={() => handleStyleSelect(style.id)}
                >
                  {/* Style Image Preview */}
                  <div className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 shadow-sm transition-all duration-300 ${selectedStyleId === style.id
                    ? "ring-2 ring-black ring-offset-2 opacity-100"
                    : "opacity-60 hover:opacity-100 hover:shadow-md"
                    }`}>
                    <Image
                      src={style.imagePath}
                      alt={style.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>

                  {/* Style Info */}
                  <div className="flex items-start justify-between gap-2 px-1">
                    <div className="min-w-0">
                      <h3 className={`font-bold text-sm truncate ${selectedStyleId === style.id ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}`}>
                        {style.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {style.prompt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Metadata */}
          <div className="max-w-2xl">
            {photo.description && (
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                {photo.description}
              </p>
            )}

            {/* Camera Metadata */}
          </div>

          {/* Inconspicuous Download Button */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
            <button
              onClick={handleDownloadAll}
              disabled={downloading}
              className="group flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-900 text-xs font-medium transition-colors disabled:opacity-50"
              title="Download All Assets"
            >
              {downloading ? (
                <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
              )}
              <span className="underline underline-offset-4 decoration-transparent group-hover:decoration-gray-300 transition-all">Download Assets</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

