"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa"; // Using react-icons

import ImageComparisonSlider from "../../../components/photos/ImageComparisonSlider";
import { getPhoto } from "../../../lib/data";
import type { Photo } from "../../../types";

// --- Helper: Enhanced Error Message Component ---
function ErrorDisplay({
  title = "Error",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="my-3 rounded border border-red-300 bg-red-50 p-2">
      <div className="flex items-center">
        <FaExclamationTriangle
          className="h-4 w-4 text-red-400 mr-2 flex-shrink-0"
          aria-hidden="true"
        />
        <div>
          <h3 className="text-xs font-medium text-red-800">{title}</h3>
          <p className="text-xs text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
}

// --- Photo component types ---
const PhotoComponents = {
  comparison: ComparisonPhoto,
  single: SinglePhoto,
  gallery: GalleryPhoto,
  "art-styles": ArtStylesPhoto,
};

// --- Main Page Component ---
export default function PhotoPage() {
  const { id } = useParams() as { id: string };
  const photo = getPhoto(id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Loading State: Basic Spinner (CSS only) ---
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        {/* Basic CSS Spinner */}
        <style jsx>{`
          .loader {
            border: 4px solid #f3f3f3; /* Light grey */
            border-top: 4px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div className="loader"></div>
      </div>
    );
  }

  // --- Not Found State: Clearer Message ---
  if (!photo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-3 bg-gray-100 p-4 text-center">
        <FaExclamationTriangle
          className="h-8 w-8 text-amber-500"
          aria-hidden="true"
        />
        <h1 className="text-xl font-semibold text-gray-800">Photo Not Found</h1>
        <p className="max-w-md text-sm text-gray-600">
          Sorry, the photo you were looking for doesn't seem to exist or may
          have been moved.
        </p>
        <Link
          href="/photos"
          className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          <FaArrowLeft className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          Back to Photo Gallery
        </Link>
      </div>
    );
  }

  // Dynamically render the appropriate photo component based on type
  const PhotoComponent = PhotoComponents[photo.type];

  // Subtle background using photo color with low opacity, default to very light gray
  const pageBackgroundColor = photo.color ? `${photo.color}1A` : "#F9FAFB"; // gray-50

  return (
    <div
      className="photo-page min-h-screen p-4 sm:p-6 lg:p-8" // Generous page padding
      style={{ backgroundColor: pageBackgroundColor }}
    >
      {/* Using max-w-5xl for more space around content, enhanced padding/styling */}
      <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-3 shadow-md md:p-5">
        {/* Back Navigation */}
        <div className="mb-3">
          <Link
            href="/photos"
            className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 rounded"
          >
            <FaArrowLeft className="mr-1 h-3 w-3" aria-hidden="true" />
            Back to Gallery
          </Link>
        </div>

        {/* Header Section: Compact */}
        <header className="mb-4 border-b border-gray-200 pb-3">
          <h1 className="mb-1 text-center text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            {photo.title}
          </h1>
          {photo.description && (
            <p className="mb-2 text-center text-sm text-gray-600">
              {photo.description}
            </p>
          )}
          {/* Meta Info: Smaller */}
          <div className="text-center text-xs text-gray-500">
            <span>{photo.date}</span>
            {photo.location && (
              <span className="before:content-['•'] before:mx-1">
                {photo.location}
              </span>
            )}
          </div>
        </header>

        {/* Main Content Area: Reduced spacing */}
        <main className="mb-4">
          <PhotoComponent photo={photo} />
        </main>

        {/* Optional Footer Area (can add related photos, etc. later) */}
        {/* Currently empty, but provides structure */}
        <footer>
          {/* Example: Could add a simple "End of content" or related links */}
        </footer>
      </div>
    </div>
  );
}

// --- Sub-Components (Enhanced Styling) ---

// Component for comparison type photos (before/after slider)
function ComparisonPhoto({ photo }: { photo: Photo }) {
  if (!photo.images.before || !photo.images.after) {
    return (
      <ErrorDisplay message="Missing before or after images required for comparison." />
    );
  }

  // Original wrapper structure ensures it fits container width.
  // Slider itself handles aspect ratio.
  return (
    <div className="max-w-full mx-auto overflow-hidden rounded-lg border border-gray-200">
      <ImageComparisonSlider
        imageBefore={photo.images.before}
        imageAfter={photo.images.after}
        altBefore={`${photo.title} - Before`}
        altAfter={`${photo.title} - After`}
        aspectRatio={photo.aspectRatio || "16 / 9"} // Key for maintaining size ratio
      />
    </div>
  );
}

// Component for single photo display
function SinglePhoto({ photo }: { photo: Photo }) {
  if (!photo.images.main) {
    return <ErrorDisplay message="The main image could not be loaded." />;
  }

  // Container defines aspect ratio, Image fills it using 'contain'
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50" // Added subtle bg
      style={{ aspectRatio: photo.aspectRatio || "16 / 9" }} // Key for maintaining size ratio
    >
      <Image
        src={photo.images.main}
        alt={photo.title}
        fill
        style={{ objectFit: "contain" }} // Ensures whole image is visible within aspect ratio
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px" // Adjusted for max-w-5xl
      />
    </div>
  );
}

// Component for gallery type photos
function GalleryPhoto({ photo }: { photo: Photo }) {
  if (!photo.images.gallery || photo.images.gallery.length === 0) {
    return (
      <ErrorDisplay message="No gallery images are available for this item." />
    );
  }

  return (
    // Responsive grid with improved item styling
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {photo.images.gallery.map((image: string, index: number) => (
        <div
          key={index}
          className="group relative aspect-1 overflow-hidden rounded-lg border border-gray-200 shadow-sm transition duration-200 ease-in-out hover:shadow-lg" // aspect-1 for square
        >
          <Image
            src={image}
            alt={`${photo.title} - Gallery Image ${index + 1}`}
            fill
            style={{ objectFit: "cover" }} // Cover fills the square space
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="bg-gray-100 transition-transform duration-300 ease-in-out group-hover:scale-105" // Subtle zoom on hover
          />
          {/* Optional: Add overlay or icon on hover */}
        </div>
      ))}
    </div>
  );
}

// Component for art styles comparison
function ArtStylesPhoto({ photo }: { photo: Photo }) {
  const searchParams = useSearchParams();
  const styleParam = searchParams.get("style");

  const availableStyleIds =
    photo.images.artStyles?.map((style) => style.id) || [];

  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(() => {
    if (styleParam && availableStyleIds.includes(styleParam)) {
      return styleParam;
    }
    return availableStyleIds.length > 0 ? availableStyleIds[0] : null;
  });

  // Effect to sync with URL parameters (e.g., back/forward buttons)
  useEffect(() => {
    const currentStyleParam = searchParams.get("style");
    if (currentStyleParam && availableStyleIds.includes(currentStyleParam)) {
      if (currentStyleParam !== selectedStyleId) {
        setSelectedStyleId(currentStyleParam);
      }
    } else if (
      !currentStyleParam &&
      selectedStyleId !== null &&
      availableStyleIds.length > 0
    ) {
      // Optional: Reset to default if URL param is removed?
      // if (selectedStyleId !== availableStyleIds[0]) {
      //    setSelectedStyleId(availableStyleIds[0]);
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), JSON.stringify(availableStyleIds)]);

  if (
    !photo.images.artStyles ||
    photo.images.artStyles.length === 0 ||
    !photo.images.original
  ) {
    return (
      <ErrorDisplay message="Art styles or the original image are missing for comparison." />
    );
  }

  const currentStyle = photo.images.artStyles.find(
    (style) => style.id === selectedStyleId
  );

  if (!currentStyle) {
    // Should ideally not happen with the improved state initialization
    return <ErrorDisplay message="Could not find the selected art style." />;
  }

  // Function to update state and URL (using replaceState)
  const handleStyleSelect = (styleId: string) => {
    setSelectedStyleId(styleId);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("style", styleId);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    // Replace state doesn't add to browser history, good for toggles
    window.history.replaceState({}, "", `${window.location.pathname}${query}`);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="max-w-full mx-auto">
        <ImageComparisonSlider
          imageBefore={photo.images.original}
          imageAfter={currentStyle.imagePath}
          altBefore={`${photo.title} - Original`}
          altAfter={`${photo.title} - ${currentStyle.name} Style`}
          aspectRatio={photo.aspectRatio || "16 / 9"} // Key for maintaining size ratio
        />
      </div>

      {/* Art Style Selector Buttons: Compact styling */}
      <div className="flex flex-wrap justify-center gap-2">
        {photo.images.artStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => handleStyleSelect(style.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ease-in-out border focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-400 ${
              currentStyle.id === style.id
                ? "border-blue-600 bg-blue-600 text-white shadow-sm" // Selected style
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400" // Non-selected style
            }`}
            aria-pressed={currentStyle.id === style.id}
          >
            {style.name}
          </button>
        ))}
      </div>
    </div>
  );
}
