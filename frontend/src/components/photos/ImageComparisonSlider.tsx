"use client";
import Image, { StaticImageData } from "next/image";
import React, { useCallback, useRef, useState } from "react";
import styles from "./ImageComparisonSlider.module.css"; // We'll create this CSS module next

interface ImageComparisonSliderProps {
  imageBefore: string | StaticImageData; // URL or imported image data
  imageAfter: string | StaticImageData; // URL or imported image data
  altBefore?: string;
  altAfter?: string;
  containerWidth?: string; // Optional: e.g., '500px', '100%', '80vw'
  containerHeight?: string; // Optional: Provide height or use aspectRatio
  aspectRatio?: string; // Optional: e.g., '16/9', '1/1'. Overrides height if both are set.
}

const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  imageBefore,
  imageAfter,
  altBefore = "Before image",
  altAfter = "After image",
  containerWidth = "100%",
  containerHeight, // Defaults handled by aspectRatio or CSS
  aspectRatio = "16 / 9", // Default aspect ratio
}) => {
  // Debug logs to check if props are being passed correctly
  console.log("ImageComparisonSlider props:", {
    imageBefore,
    imageAfter,
    aspectRatio,
  });

  const [sliderPosition, setSliderPosition] = useState<number>(50); // Initial position (percentage)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    // Calculate position relative to the container, clamp between 0 and 100
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  }, []); // No dependencies needed as rect is recalculated on each move

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent text selection/image dragging
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    // No preventDefault here unless needed to stop scrolling maybe
  };

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  ); // Depend on isDragging and handleMove

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  ); // Depend on isDragging and handleMove

  // Add/remove global listeners for mouse/touch move outside the component
  React.useEffect(() => {
    // Use window for mouse events to track outside the element
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    // Use document for touch events as they might bubble differently
    document.addEventListener("touchmove", handleTouchMove, { passive: true }); // Consider passive for performance
    document.addEventListener("touchend", handleTouchEnd);

    // Debug container dimensions
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      console.log("Container dimensions:", {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]); // Re-attach if handlers change

  // Determine container style based on props
  const containerDynamicStyle: React.CSSProperties = {
    width: containerWidth,
    aspectRatio: containerHeight ? undefined : aspectRatio, // Only apply aspect ratio if height isn't explicitly set
    height: containerHeight || "400px", // Add a default height to ensure visibility
    position: "relative", // Crucial for Next/Image fill and absolute positioning
    overflow: "hidden", // Prevent handle overflow
    cursor: isDragging ? "grabbing" : "grab",
    border: "1px solid #e0e0e0", // Add border to make the container visible
  };

  return (
    <div
      ref={containerRef}
      className={styles.comparisonContainer}
      style={containerDynamicStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      data-testid="image-comparison-slider"
    >
      {/* After Image (Bottom Layer) */}
      <div className={styles.imageWrapper}>
        <Image
          src={imageAfter}
          alt={altAfter}
          fill // Makes the image fill the parent div
          style={{ objectFit: "cover" }} // Ensures the image covers the area, maintaining aspect ratio
          priority // Consider adding priority if it's LCP
          draggable={false} // Prevent native image dragging
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
        />
      </div>

      {/* Before Image (Top Layer - Clipped) */}
      <div
        className={`${styles.imageWrapper} ${styles.imageBeforeWrapper}`}
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, // Clip from the right
          zIndex: 2, // Ensure it's above the after image
        }}
      >
        <Image
          src={imageBefore}
          alt={altBefore}
          fill
          style={{ objectFit: "cover" }}
          priority
          draggable={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
        />
      </div>

      {/* Slider Handle */}
      <div
        className={styles.sliderHandle}
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown} // Allow dragging the handle itself
        onTouchStart={handleTouchStart}
      >
        <div className={styles.sliderHandleLine}></div>
        <div className={styles.sliderHandleGrip}>
          {/* You can add SVG icons here for arrows */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.gripIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </div>
      </div>

      {/* Optional: Range input (can be visually hidden but used for accessibility) */}
      {/*
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        className={styles.sliderInput} // Style to hide visually but keep accessible
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        aria-label="Adjust image comparison"
      />
      */}
    </div>
  );
};

export default ImageComparisonSlider;
