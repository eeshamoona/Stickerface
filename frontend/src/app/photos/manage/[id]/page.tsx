"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Photo } from "@/types";
import PhotoForm from "@/components/photos/PhotoForm";

export default function EditPhotoPage() {
    const { id } = useParams() as { id: string };
    const [photo, setPhoto] = useState<Photo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPhoto() {
            try {
                const { data } = await supabase
                    .from("photos")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (data) {
                    setPhoto({
                        ...data,
                        aspectRatio: data.aspect_ratio,
                    } as Photo);
                }
            } catch {
                // Error handling is done via UI feedback or logging if needed
            }
            setLoading(false);
        }

        if (id) {
            fetchPhoto();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
            </div>
        );
    }

    if (!photo) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Photo not found</h1>
            </div>
        );
    }

    return <PhotoForm initialPhoto={photo} />;
}
