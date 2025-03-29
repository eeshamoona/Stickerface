// src/app/photos/[id]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ImageComparisonSlider from "../../../components/photos/ImageComparisonSlider";
import { getPhoto } from "../../../lib/data";
import type { Photo } from "../../../types";

// Photo component types
const PhotoComponents = {
  comparison: ComparisonPhoto,
  single: SinglePhoto,
  gallery: GalleryPhoto,
  "art-styles": ArtStylesPhoto,
};

export default function PhotoPage() {
  const { id } = useParams() as { id: string };
  const photo = getPhoto(id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!photo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
        <p className="text-xl text-slate-700 mb-4">Photo not found</p>
        <Link href="/photos" className="text-blue-500 hover:underline">
          Back to photo gallery
        </Link>
      </div>
    );
  }

  // Dynamically render the appropriate photo component based on type
  const PhotoComponent = PhotoComponents[photo.type];

  return (
    <div
      className="photo-page flex flex-col items-center min-h-screen p-4"
      style={{ backgroundColor: photo.color ? `${photo.color}20` : "#f8f9fa" }}
    >
      <div className="photo-content-container w-full max-w-4xl flex-grow flex flex-col justify-center p-4 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">{photo.title}</h1>
        <p className="text-gray-600 text-center mb-6">{photo.description}</p>
        <div className="mt-6 text-sm text-gray-500 flex justify-between">
          <span>{photo.date}</span>
          {photo.location && <span>{photo.location}</span>}
        </div>
        <PhotoComponent photo={photo} />

        <div className="mt-8 text-center">
          <Link href="/photos" className="text-blue-500 hover:underline">
            Back to photo gallery
          </Link>
        </div>
      </div>
    </div>
  );
}

// Component for comparison type photos (before/after slider)
function ComparisonPhoto({ photo }: { photo: Photo }) {
  if (!photo.images.before || !photo.images.after) {
    return (
      <p className="text-red-500">Missing before/after images for comparison</p>
    );
  }

  return (
    <div className="max-w-full mx-auto">
      <ImageComparisonSlider
        imageBefore={photo.images.before}
        imageAfter={photo.images.after}
        altBefore={`${photo.title} - Before`}
        altAfter={`${photo.title} - After`}
        aspectRatio={photo.aspectRatio || "16 / 9"}
      />
    </div>
  );
}

// Component for single photo display
function SinglePhoto({ photo }: { photo: Photo }) {
  if (!photo.images.main) {
    return <p className="text-red-500">Missing main image</p>;
  }

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: photo.aspectRatio || "16 / 9" }}
    >
      <Image
        src={photo.images.main}
        alt={photo.title}
        fill
        style={{ objectFit: "contain" }}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
    </div>
  );
}

// Component for gallery type photos
function GalleryPhoto({ photo }: { photo: Photo }) {
  if (!photo.images.gallery || photo.images.gallery.length === 0) {
    return <p className="text-red-500">No gallery images available</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photo.images.gallery.map((image: string, index: number) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden rounded-lg"
        >
          <Image
            src={image}
            alt={`${photo.title} - Image ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}

// Component for art styles comparison
function ArtStylesPhoto({ photo }: { photo: Photo }) {
  const searchParams = useSearchParams();
  const styleParam = searchParams.get("style");

  // For debugging
  console.log("Photo data:", photo);
  console.log("Art styles:", photo.images.artStyles);
  console.log("Original image path:", photo.images.original);

  // Initialize with style from URL parameter if available and valid
  const [selectedStyle, setSelectedStyle] = useState<string | null>(
    styleParam &&
      photo.images.artStyles?.some((style) => style.id === styleParam)
      ? styleParam
      : null
  );

  if (!photo.images.artStyles || photo.images.artStyles.length === 0) {
    return (
      <p className="text-red-500">No art styles available for this photo</p>
    );
  }

  // Default to first art style if none selected
  const currentStyle = selectedStyle
    ? photo.images.artStyles.find((style) => style.id === selectedStyle)
    : photo.images.artStyles[0];

  if (!currentStyle) {
    return <p className="text-red-500">Selected art style not found</p>;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="max-w-full mx-auto">
        <ImageComparisonSlider
          imageBefore={photo.images.original}
          imageAfter={currentStyle.imagePath}
          altBefore={`${photo.title} - Original`}
          altAfter={`${photo.title} - ${currentStyle.name} Style`}
          aspectRatio={photo.aspectRatio || "16 / 9"}
        />
      </div>

      {/* Art style selector buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {photo.images.artStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentStyle.id === style.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            aria-pressed={currentStyle.id === style.id}
          >
            {style.name}
          </button>
        ))}
      </div>

      {/* Description of the current art style */}
      <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <h3 className="font-medium text-lg mb-2">{currentStyle.name}</h3>
        <p className="text-gray-700">{currentStyle.description}</p>
      </div>
    </div>
  );
}
