"use client";

import { useState, useEffect } from "react";
import { uploadImage, addPhoto } from "@/lib/storage";
import { Photo, ArtStyle } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageComparisonSlider from "@/components/photos/ImageComparisonSlider";
import imageCompression from "browser-image-compression";
import { extractFrameFromVideo, generateVideoThumbnails } from "@/lib/video-utils";

interface PhotoFormProps {
    initialPhoto?: Photo;
}

export default function PhotoForm({ initialPhoto }: PhotoFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

    // Form State
    const [title, setTitle] = useState(initialPhoto?.title || "");
    const [slug, setSlug] = useState(initialPhoto?.slug || "");
    const [description, setDescription] = useState(initialPhoto?.description || "");
    const [date, setDate] = useState(initialPhoto?.date || "");
    const [location, setLocation] = useState(initialPhoto?.location || "");

    const [aspectRatio, setAspectRatio] = useState(initialPhoto?.aspectRatio || "16 / 9");
    const [objectPosition, setObjectPosition] = useState(initialPhoto?.objectPosition || "50% 50%");
    // Metadata removed as per request, but keeping state if we need to re-add later or for DB compatibility
    const [metadata, setMetadata] = useState(initialPhoto?.metadata || {});

    // Set date on client-side only
    useEffect(() => {
        if (!initialPhoto) {
            setDate(new Date().toISOString().split("T")[0]);
        }
    }, [initialPhoto]);

    // Image Files State
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoThumbnails, setVideoThumbnails] = useState<{ file: File; url: string }[]>([]);
    const [artStyles, setArtStyles] = useState<{ name: string; prompt: string; image: File | null; objectPosition?: string }[]>(
        initialPhoto?.images.artStyles?.map(style => ({
            name: style.name,
            prompt: style.prompt,
            image: null,
            objectPosition: style.objectPosition || "50% 50%"
        })) || []
    );

    // Previews
    const [previews, setPreviews] = useState<{ [key: string]: string }>({
        original: initialPhoto?.images.original || "",
        ...Object.fromEntries(
            initialPhoto?.images.artStyles?.map((style, idx) => [`style-${idx}`, style.imagePath]) || []
        )
    });
    const [selectedPreviewStyle, setSelectedPreviewStyle] = useState<number>(0);
    const [alignmentTarget, setAlignmentTarget] = useState<"original" | number>("original");

    const handleImageChange = async (
        key: string,
        file: File | null,
        setter: (f: File | null) => void,
        calculateRatio: boolean = false
    ) => {
        if (file) {
            const options = {
                maxSizeMB: 4,
                maxWidthOrHeight: 2560,
                useWebWorker: true,
            };
            try {
                const compressedFile = await imageCompression(file, options);
                setter(compressedFile);
                const url = URL.createObjectURL(compressedFile);
                setPreviews((prev) => ({ ...prev, [key]: url }));

                if (calculateRatio) {
                    const img = new window.Image();
                    img.onload = () => {
                        const w = img.width;
                        const h = img.height;
                        const ratio = w / h;

                        let aspectRatio = "16 / 9";
                        if (Math.abs(ratio - 1) < 0.05) aspectRatio = "1 / 1";
                        else if (Math.abs(ratio - 4 / 3) < 0.05) aspectRatio = "4 / 3";
                        else if (Math.abs(ratio - 3 / 2) < 0.05) aspectRatio = "3 / 2";
                        else if (Math.abs(ratio - 16 / 9) < 0.05) aspectRatio = "16 / 9";
                        else if (Math.abs(ratio - 3 / 4) < 0.05) aspectRatio = "3 / 4";
                        else if (Math.abs(ratio - 2 / 3) < 0.05) aspectRatio = "2 / 3";
                        else if (Math.abs(ratio - 9 / 16) < 0.05) aspectRatio = "9 / 16";
                        else {
                            const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
                            const divisor = gcd(w, h);
                            const simplifiedW = w / divisor;
                            const simplifiedH = h / divisor;
                            aspectRatio = (simplifiedW > 100 || simplifiedH > 100)
                                ? `${Math.round(ratio * 100) / 100} / 1`
                                : `${simplifiedW} / ${simplifiedH}`;
                        }
                        setAspectRatio(aspectRatio);
                    };
                    img.src = url;
                }
            } catch (error) {
                console.error("Compression error:", error);
                // Fallback to original file
                setter(file);
                const url = URL.createObjectURL(file);
                setPreviews((prev) => ({ ...prev, [key]: url }));
            }
        } else {
            setter(null);
            setPreviews((prev) => {
                const newPreviews = { ...prev };
                delete newPreviews[key];
                return newPreviews;
            });
        }
    };

    const handleVideoChange = async (file: File | null) => {
        if (file) {
            setVideoFile(file);
            try {
                // Generate thumbnails
                const thumbnails = await generateVideoThumbnails(file, 5);
                const thumbnailData = thumbnails.map(t => ({
                    file: t,
                    url: URL.createObjectURL(t)
                }));
                setVideoThumbnails(thumbnailData);

                // Set the middle thumbnail as default if no original image is set
                if (thumbnailData.length > 0 && !originalImage && !initialPhoto?.images.original) {
                    handleImageChange("original", thumbnailData[Math.floor(thumbnailData.length / 2)].file, setOriginalImage, true);
                }
            } catch (error) {
                console.error("Error processing video:", error);
                setError("Failed to process video. Please try another file.");
            }
        } else {
            setVideoFile(null);
            setVideoThumbnails([]);
        }
    };

    const handleArtStyleImageChange = async (index: number, file: File | null) => {
        if (file) {
            const options = {
                maxSizeMB: 4,
                maxWidthOrHeight: 2560,
                useWebWorker: true,
            };
            try {
                const compressedFile = await imageCompression(file, options);
                const newStyles = [...artStyles];
                newStyles[index] = { ...newStyles[index], image: compressedFile };
                setArtStyles(newStyles);
                setPreviews(prev => ({ ...prev, [`style-${index}`]: URL.createObjectURL(compressedFile) }));
            } catch (error) {
                console.error("Compression error:", error);
                const newStyles = [...artStyles];
                newStyles[index] = { ...newStyles[index], image: file };
                setArtStyles(newStyles);
                setPreviews(prev => ({ ...prev, [`style-${index}`]: URL.createObjectURL(file) }));
            }
        } else {
            const newStyles = [...artStyles];
            newStyles[index] = { ...newStyles[index], image: null };
            setArtStyles(newStyles);
        }
    };

    const handleAddArtStyle = () => {
        setArtStyles([...artStyles, { name: "", prompt: "", image: null, objectPosition: "50% 50%" }]);
    };

    const handleRemoveArtStyle = (index: number) => {
        const newStyles = [...artStyles];
        newStyles.splice(index, 1);
        setArtStyles(newStyles);

        setPreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[`style-${index}`];
            return newPreviews;
        });

        if (selectedPreviewStyle >= newStyles.length) {
            setSelectedPreviewStyle(Math.max(0, newStyles.length - 1));
        }
    };

    const handleArtStyleChange = (index: number, field: "name" | "prompt", value: string) => {
        const newStyles = [...artStyles];
        newStyles[index] = { ...newStyles[index], [field]: value };
        setArtStyles(newStyles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const photoId = initialPhoto?.id || slug || title.toLowerCase().replace(/\\s+/g, "-") + "-" + Date.now();

            // Upload original image if changed
            let originalUrl = initialPhoto?.images.original || "";
            if (originalImage) {
                const formData = new FormData();
                formData.append("file", originalImage);
                formData.append("filename", `${slug || photoId}/original-${Date.now()}.${originalImage.name.split('.').pop()}`);
                originalUrl = await uploadImage(formData);
            }

            if (!originalUrl) throw new Error("Original image is required");

            // Upload video if present
            let videoUrl = initialPhoto?.images.video || "";
            if (videoFile) {
                const formData = new FormData();
                formData.append("file", videoFile);
                formData.append("filename", `${slug || photoId}/video-${Date.now()}.${videoFile.name.split('.').pop()}`);
                videoUrl = await uploadImage(formData);
            }

            // Upload art styles
            const uploadedStyles: ArtStyle[] = [];
            for (let i = 0; i < artStyles.length; i++) {
                const style = artStyles[i];
                if (!style.name) continue;

                let styleUrl = "";
                if (style.image) {
                    const formData = new FormData();
                    formData.append("file", style.image);
                    const styleNameSlug = style.name.toLowerCase().replace(/\s+/g, "-");
                    formData.append("filename", `${slug || photoId}/${styleNameSlug}-${Date.now()}.${style.image.name.split('.').pop()}`);
                    styleUrl = await uploadImage(formData);
                } else if (initialPhoto?.images.artStyles?.[i]) {
                    styleUrl = initialPhoto.images.artStyles[i].imagePath;
                }

                if (styleUrl) {
                    uploadedStyles.push({
                        id: style.name.toLowerCase().replace(/\\s+/g, "-"),
                        name: style.name,
                        prompt: style.prompt,
                        imagePath: styleUrl,
                        objectPosition: (style as any).objectPosition || "50% 50%",
                    });
                }
            }

            const photoData: Photo = {
                id: photoId,
                slug: slug || photoId,
                title,
                description,
                date,
                location,
                images: {
                    original: originalUrl,
                    video: videoUrl || undefined,
                    artStyles: uploadedStyles
                },
                aspectRatio,
                objectPosition,
                metadata,
            };

            await addPhoto(photoData);
            router.push("/photos");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const LivePreview = () => {
        const currentStyle = artStyles[selectedPreviewStyle];
        const currentStylePreview = previews[`style-${selectedPreviewStyle}`];
        const originalPreview = previews["original"];

        return (
            <div className="h-full overflow-y-auto bg-gray-50 p-6 md:p-12">
                <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
                    <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                        </div >
                        <div className="flex-1 text-center text-[10px] text-gray-400 font-mono">
                            stickerface.app / photos / {slug || "your-slug"}
                        </div >
                    </div >

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {
                                    title || "Untitled Photo"}
                            </h1 >
                            <p className="text-gray-500 text-sm max-w-md mx-auto">
                                {
                                    description || "No description yet..."}
                            </p >
                            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400 uppercase tracking-wider">
                                <span > {date || "YYYY-MM-DD"}</span>
                                {
                                    location && (
                                        <>
                                            <span>•</span>
                                            <span>{location}</span>
                                        </>
                                    )
                                }
                            </div >
                        </div >

                        <div className="mb-8">
                            {
                                originalPreview ? (
                                    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        {
                                            currentStylePreview ? (
                                                <ImageComparisonSlider
                                                    imageBefore={originalPreview}
                                                    imageAfter={currentStylePreview}
                                                    altBefore="Original"
                                                    altAfter={currentStyle?.name || "Style"}
                                                    aspectRatio={aspectRatio}
                                                />
                                            ) : (
                                                <div className="relative w-full" style={{ aspectRatio }}>
                                                    <Image src={originalPreview} alt="Original" fill className="object-contain bg-gray-50" />
                                                </div >
                                            )
                                        }
                                    </div >
                                ) : (
                                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                        Upload original image to preview
                                    </div >
                                )
                            }
                        </div >

                        {
                            artStyles.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                        Select Style
                                    </h3>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {
                                            artStyles.map((style, idx) => (
                                                <button
                                                    type="button"
                                                    key={idx}
                                                    onClick={() => setSelectedPreviewStyle(idx)}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${selectedPreviewStyle === idx
                                                        ? "bg-gray-900 text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        } `}
                                                >
                                                    {style.name || `Style ${idx + 1} `}
                                                </button>
                                            ))}
                                    </div>
                                    {currentStyle?.prompt && (
                                        <div className="text-center mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <p className="text-xs text-gray-500 italic">
                                                "{currentStyle.prompt}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Mobile Tabs */}
            <div className="md:hidden flex border-b border-gray-200 bg-white z-10">
                <button
                    onClick={() => setActiveTab("form")}
                    className={`flex - 1 py - 3 text - sm font - medium ${activeTab === "form" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                >
                    Edit
                </button >
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 py-3 text-sm font-medium ${activeTab === "preview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                >
                    Preview
                </button>
            </div>

            {/* Left Side: Form */}
            <div className={`w-full md:w-1/2 h-full overflow-y-auto border-r border-gray-200 bg-white p-6 md:p-12 ${activeTab === "preview" ? "hidden md:block" : ""}`}>
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {initialPhoto ? "Edit Photo" : "Create Photo"}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {initialPhoto ? "Update photo details and add new styles." : "Add new photos and generate art styles."}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <section className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                                    placeholder="e.g. Summer Vacation"
                                />
                            </div >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                                        placeholder="summer-vacation"
                                    />
                                </div >
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                                    />
                                </div >
                            </div >
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                                    placeholder="e.g. Paris, France"
                                />
                            </div >
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Description</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none text-sm"
                                    rows={3}
                                    placeholder="Tell the story..."
                                />
                            </div >
                        </section >

                        {/* Original Image */}
                        <section className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-gray-900">Original Photo</h2>
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-medium text-gray-500">Aspect Ratio:</label>
                                    <input
                                        type="text"
                                        value={aspectRatio}
                                        onChange={(e) => setAspectRatio(e.target.value)}
                                        className="w-20 px-2 py-0.5 text-[10px] font-medium bg-gray-100 rounded text-gray-700 border border-gray-200 focus:ring-1 focus:ring-black outline-none"
                                        placeholder="16 / 9"
                                    />
                                </div>
                            </div >

                            <div className={`relative border border-dashed border-gray-300 rounded-lg p-6 transition-all hover:border-black hover:bg-gray-50 ${!previews["original"] ? 'bg-gray-50' : 'bg-white'}`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange("original", e.target.files?.[0] || null, setOriginalImage, true)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {
                                    previews["original"] ? (
                                        <div className="relative w-full h-40 rounded overflow-hidden">
                                            <Image src={previews["original"]} alt="Preview" fill className="object-contain" />
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 font-medium">
                                                {
                                                    initialPhoto ? "Upload new original (optional)" : "Upload Original"}
                                            </p >
                                        </div >
                                    )
                                }
                            </div >
                        </section >

                        {/* Alignment */}
                        <section className="space-y-4 pt-4 border-t border-gray-100">
                            <h2 className="text-sm font-bold text-gray-900">Alignment</h2>

                            <div className="space-y-3">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    <button
                                        type="button"
                                        onClick={() => setAlignmentTarget("original")}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${alignmentTarget === "original"
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        Original
                                    </button>
                                    {artStyles.map((style, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setAlignmentTarget(idx)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${alignmentTarget === idx
                                                ? "bg-black text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {style.name || `Style ${idx + 1}`}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-crosshair group">
                                    {(() => {
                                        const targetImage = alignmentTarget === "original"
                                            ? previews["original"]
                                            : previews[`style-${alignmentTarget}`];

                                        const targetPosition = alignmentTarget === "original"
                                            ? objectPosition
                                            : (artStyles[alignmentTarget as number] as any).objectPosition || "50% 50%";

                                        if (targetImage) {
                                            return (
                                                <>
                                                    <Image
                                                        src={targetImage}
                                                        alt="Alignment Preview"
                                                        fill
                                                        className="object-cover"
                                                        style={{ objectPosition: targetPosition }}
                                                        onClick={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const x = ((e.clientX - rect.left) / rect.width) * 100;
                                                            const y = ((e.clientY - rect.top) / rect.height) * 100;
                                                            const newPos = `${Math.round(x)}% ${Math.round(y)}%`;

                                                            if (alignmentTarget === "original") {
                                                                setObjectPosition(newPos);
                                                            } else {
                                                                const newStyles = [...artStyles];
                                                                (newStyles[alignmentTarget as number] as any).objectPosition = newPos;
                                                                setArtStyles(newStyles);
                                                            }
                                                        }}
                                                    />
                                                    <div
                                                        className="absolute w-4 h-4 border-2 border-white rounded-full shadow-sm pointer-events-none transform -translate-x-1/2 -translate-y-1/2 bg-black/20"
                                                        style={{
                                                            left: targetPosition.split(' ')[0],
                                                            top: targetPosition.split(' ')[1]
                                                        }}
                                                    />
                                                </>
                                            );
                                        } else {
                                            return (
                                                <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                                    {alignmentTarget === "original" ? "Upload original image" : "Upload style image"} to set alignment
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                                <p className="text-[10px] text-gray-500">
                                    Click to set focal point for {alignmentTarget === "original" ? "the original photo" : "this art style"}.
                                </p>
                            </div>
                        </section>

                        {/* Video Upload (Optional) */}
                        <section className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="pt-2">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">
                                    Video Source (Optional)
                                </label>
                                <div className="flex items-center gap-3">
                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded text-xs font-medium transition-colors">
                                        {videoFile ? "Change Video" : "Upload Video"}
                                        <input
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) => handleVideoChange(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                    {videoFile && (
                                        <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                            {videoFile.name}
                                        </span>
                                    )}
                                    {!videoFile && initialPhoto?.images.video && (
                                        <span className="text-xs text-gray-500">
                                            Existing video attached
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Uploading a video will automatically generate thumbnails. Select one to use as the cover image.
                                </p>

                                {videoThumbnails.length > 0 && (
                                    <div className="mt-3">
                                        <label className="text-[10px] font-medium text-gray-500 block mb-2">Select Cover Frame:</label>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {videoThumbnails.map((thumb, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handleImageChange("original", thumb.file, setOriginalImage, true)}
                                                    className="relative w-20 h-12 shrink-0 rounded overflow-hidden border-2 border-transparent hover:border-blue-500 focus:border-blue-500 transition-all"
                                                >
                                                    <Image
                                                        src={thumb.url}
                                                        alt={`Frame ${idx}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Art Styles */}
                        <section className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-gray-900">Art Styles</h2>
                                <button
                                    type="button"
                                    onClick={handleAddArtStyle}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide"
                                >
                                    + Add Style
                                </button>
                            </div>

                            <div className="space-y-6">
                                {
                                    artStyles.map((style, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 relative group border border-gray-100 hover:border-gray-300 transition-colors">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveArtStyle(index)}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg >
                                            </button >

                                            <div className="space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="flex-1 space-y-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Style Name"
                                                            value={style.name}
                                                            onChange={(e) => handleArtStyleChange(index, "name", e.target.value)}
                                                            className="w-full px-3 py-1.5 rounded border border-gray-200 focus:ring-1 focus:ring-black outline-none text-sm bg-white"
                                                        />
                                                        <textarea
                                                            placeholder="Prompt used..."
                                                            value={style.prompt}
                                                            onChange={(e) => handleArtStyleChange(index, "prompt", e.target.value)}
                                                            className="w-full px-3 py-1.5 rounded border border-gray-200 focus:ring-1 focus:ring-black outline-none text-sm bg-white resize-none"
                                                            rows={2}
                                                        />
                                                    </div >
                                                    <div className="w-24 shrink-0">
                                                        <div className="relative h-24 border border-dashed border-gray-300 rounded bg-white hover:border-black overflow-hidden">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleArtStyleImageChange(index, e.target.files?.[0] || null)}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            />
                                                            {
                                                                previews[`style-${index}`] ? (
                                                                    <Image src={previews[`style-${index}`]} alt="Preview" fill className="object-cover" />
                                                                ) : (
                                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                                                        <span className="text-[10px]">Img</span>
                                                                    </div >
                                                                )}
                                                        </div >
                                                    </div >
                                                </div >
                                            </div >
                                        </div >
                                    ))}
                            </div >
                        </section >

                        <div className="pt-4 sticky bottom-0 bg-white pb-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {
                                    loading ? "Saving..." : initialPhoto ? "Update Photo" : "Save Photo"}
                            </button>
                        </div >
                    </form >
                </div >
            </div >

            {/* Right Side: Preview */}
            < div className={`w-full md:w-1/2 h-full bg-gray-50 ${activeTab === "form" ? "hidden md:block" : ""}`
            }>
                < LivePreview />
            </div >
        </div >
    );
}
