"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Photo } from "@/types";
import Link from "next/link";
import Image from "next/image";

import { deletePhoto } from "@/lib/storage";

export default function ManagePhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

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

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (deletingId === id) {
            // Confirmed
            handleDelete(id);
        } else {
            // First click
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
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-20 pb-20 px-4 sm:px-6 lg:px-8" onClick={() => setDeletingId(null)}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Manage Photos</h1>
                        <p className="text-gray-500 mt-2">Edit existing photos or create new ones.</p>
                    </div>
                    <Link
                        href="/photos/manage/new"
                        className="bg-black text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
                    >
                        + Create New
                    </Link>
                </div>

                {/* Photos List */}
                {photos.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 mb-6">No photos yet. Create your first one!</p>
                        <Link
                            href="/photos/manage/new"
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
                        >
                            + Create New Photo
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group relative"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full aspect-video bg-gray-100">
                                    <Image
                                        src={photo.images.original}
                                        alt={photo.title}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Delete Button / Confirmation Overlay */}
                                    {deletingId === photo.id ? (
                                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4 z-10 animate-in fade-in duration-200">
                                            <p className="text-white text-sm font-bold">Delete this photo?</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, photo.id)}
                                                    className="bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-700 transition-colors"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={handleCancelDelete}
                                                    className="bg-white text-black px-3 py-1.5 rounded-md text-xs font-bold hover:bg-gray-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => handleDeleteClick(e, photo.id)}
                                            className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm z-10"
                                            title="Delete Photo"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{photo.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{photo.description}</p>

                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                        <span>{photo.date}</span>
                                        {photo.location && (
                                            <>
                                                <span>•</span>
                                                <span>{photo.location}</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {photo.images.artStyles?.length || 0} style{photo.images.artStyles?.length !== 1 ? 's' : ''}
                                        </span>
                                        <Link
                                            href={`/photos/manage/${photo.id}`}
                                            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Edit →
                                        </Link>
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
