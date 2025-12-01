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
      <main className="pt-8 pb-8 md:pt-16 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Back to Gallery Link */}
        <div className="mb-6">
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

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{photo.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{new Date(photo.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                {photo.location && (
                  <>
                    <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                    <span>{photo.location}</span>
                  </>
                )}
              </div>
              {photo.description && (
                <p className="text-sm sm:text-base text-gray-600 max-w-xl pt-1 leading-relaxed">
                  {photo.description}
                </p>
              )}

              {/* Camera Metadata (if available) */}
              {(photo.metadata?.camera || photo.metadata?.lens || photo.metadata?.film) && (
                <div className="flex flex-wrap gap-2 pt-1.5 text-[10px] sm:text-xs text-gray-400 font-mono">
                  {photo.metadata.camera && <span>📷 {photo.metadata.camera}</span>}
                  {photo.metadata.lens && <span>◎ {photo.metadata.lens}</span>}
                  {photo.metadata.film && <span>🎞️ {photo.metadata.film}</span>}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 mt-2 md:mt-0">
              <button
                onClick={handleDownloadAll}
                disabled={downloading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-full text-xs font-medium transition-colors disabled:opacity-50"
                title="Download All Assets"
              >
                {downloading ? (
                  <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                )}
                Download All
              </button>
            </div>
          </div>

          {/* Comparison Slider */}
          <div className="mb-8 md:mb-12">
            <div className="max-w-3xl mx-auto max-h-[80vh] rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-full text-xs font-medium transition-colors"
                  title={isVideoPlaying ? "Pause Video" : "Play Video"}
                >
                  {isVideoPlaying ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M5 5h10v10H5z" />
                      </svg>
                      Stop Video
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      Play Video
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Art Styles Grid */}
          <div className="space-y-6">
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
        </div>
      </main>
    </div>
  );
}

