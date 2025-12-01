"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Photo } from "@/types";
import Link from "next/link";
import Image from "next/image";

export default function ManagePhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPhotos() {
            const { data, error } = await supabase
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

        fetchPhotos();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-20 pb-20 px-4 sm:px-6 lg:px-8">
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
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full aspect-video bg-gray-100">
                                    <Image
                                        src={photo.images.original}
                                        alt={photo.title}
                                        fill
                                        className="object-cover"
                                    />
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
