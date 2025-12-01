"use server";

import { put } from "@vercel/blob";
import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabase-admin";
import { Photo } from "@/types";

export async function uploadImage(formData: FormData): Promise<string> {
    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file provided");
    }

    const filename = `${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
        access: "public",
    });
    return blob.url;
}

export async function addPhoto(photo: Photo): Promise<void> {
    const dbPhoto = {
        ...photo,
        aspect_ratio: photo.aspectRatio,
        object_position: photo.objectPosition,
        metadata: photo.metadata,
    };
    delete (dbPhoto as any).aspectRatio;
    delete (dbPhoto as any).objectPosition;

    const { error } = await supabaseAdmin.from("photos").upsert(dbPhoto);
    if (error) {
        throw new Error(`Error adding photo: ${error.message}`);
    }
}

export async function getPhotos(): Promise<Photo[]> {
    const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Error fetching photos: ${error.message}`);
    }

    return (data || []).map((row: any) => ({
        ...row,
        aspectRatio: row.aspect_ratio,
        objectPosition: row.object_position,
        metadata: row.metadata,
    }));
}
