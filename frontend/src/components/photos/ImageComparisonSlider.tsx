"use client";
import Image, { StaticImageData } from "next/image";
import React, { useCallback, useRef, useState } from "react";
import styles from "./ImageComparisonSlider.module.css";

interface ImageComparisonSliderProps {
  imageBefore: string | StaticImageData;
  imageAfter: string | StaticImageData;
  altBefore?: string;
  altAfter?: string;
  containerWidth?: string;
  containerHeight?: string;
  aspectRatio?: string;
  objectPosition?: string;
  objectPositionAfter?: string;
  videoSrc?: string;
}

const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  imageBefore,
  imageAfter,
  altBefore = "Before image",
  altAfter = "After image",
  containerWidth = "100%",
  containerHeight,
  aspectRatio = "16 / 9",
  objectPosition = "50% 50%",
  objectPositionAfter,
  videoSrc,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
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
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      className={styles.comparisonContainer}
      style={{
        width: containerWidth,
        height: containerHeight,
        aspectRatio: containerHeight ? undefined : aspectRatio
      }}
      onMouseMove={(e) => isDragging && handleMove(e.clientX)}
      onTouchMove={(e) => isDragging && handleMove(e.touches[0].clientX)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      data-testid="image-comparison-slider"
    >
      <div className={styles.imageWrapper}>
        <Image
          src={imageAfter}
          alt={altAfter}
          fill
          style={{ objectFit: "cover", objectPosition: objectPositionAfter || objectPosition }}
          priority
          draggable={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div
        className={styles.imageWrapper}
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {isPlaying && videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", objectPosition }}
          />
        ) : (
          <Image
            src={imageBefore}
            alt={altBefore}
            fill
            style={{ objectFit: "cover", objectPosition }}
            priority
            draggable={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {videoSrc && !isPlaying && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(true);
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors z-20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div
        className={styles.sliderHandle}
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className={styles.sliderHandleLine}></div>
        <div className={styles.sliderHandleGrip}>
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
    </div>
  );
};

export default ImageComparisonSlider;
