"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Photo } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { deletePhoto } from "@/lib/storage";

export const dynamic = 'force-dynamic';

export default function ManagePhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPhotos();
    }, []);

    async function fetchPhotos() {
        const { data } = await supabase
            .from("photos")
            .select("*")
            .order("date", { ascending: false });

        if (data) {
            setPhotos(data.map(photo => ({
                ...photo,
                aspectRatio: photo.aspect_ratio,
            }) as Photo));
        }
        setLoading(false);
    }

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (deletingId === id) {
            handleDelete(id);
        } else {
            setDeletingId(id);
        }
    };

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDeletingId(null);
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePhoto(id);
            setPhotos(photos.filter(p => p.id !== id));
            setDeletingId(null);
        } catch {
            alert("Failed to delete photo");
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-100 border-t-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white" onClick={() => setDeletingId(null)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-gray-100 pb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Manage Photos</h1>
                        <p className="text-gray-500 max-w-md text-sm leading-relaxed">
                            Curate your gallery. Add new memories, update existing ones, or remove photos from your collection.
                        </p>
                    </div>
                    <Link
                        href="/photos/manage/new"
                        className="inline-flex items-center justify-center px-6 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                        Create New
                    </Link>
                </div>

                {/* Photos Grid */}
                {photos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No photos yet</h3>
                        <p className="text-gray-500 mb-6 text-sm">Start building your gallery by adding your first photo.</p>
                        <Link
                            href="/photos/manage/new"
                            className="text-black font-medium text-sm underline underline-offset-4 hover:text-gray-600 transition-colors"
                        >
                            Create your first photo
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative flex flex-col gap-4"
                            >
                                {/* Image Card */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
                                    <Image
                                        src={photo.images.original}
                                        alt={photo.title}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Edit Button (Overlay) */}
                                    <Link
                                        href={`/photos/manage/${photo.id}`}
                                        className="absolute inset-0 z-0"
                                    >
                                        <span className="sr-only">Edit {photo.title}</span>
                                    </Link>

                                    {/* Delete Interface */}
                                    <div className="absolute top-3 right-3 z-10">
                                        {deletingId === photo.id ? (
                                            <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg shadow-lg animate-in fade-in zoom-in duration-200">
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, photo.id)}
                                                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={handleCancelDelete}
                                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => handleDeleteClick(e, photo.id)}
                                                className="p-2 bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm transform translate-y-[-10px] group-hover:translate-y-0"
                                                title="Delete Photo"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                            {photo.title}
                                        </h3>
                                        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                            {photo.images.artStyles?.length || 0} Styles
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        {photo.location && (
                                            <>
                                                <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                                                <span className="truncate max-w-[150px]">{photo.location}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
