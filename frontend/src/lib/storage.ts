"use server";

import { put } from "@vercel/blob";
import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabase-admin";
import { ArtStyle, Photo } from "@/types";

export async function uploadImage(formData: FormData): Promise<string> {
    const file = formData.get("file") as File;
    const customFilename = formData.get("filename") as string;

    if (!file) {
        throw new Error("No file provided");
    }

    const filename = customFilename || `${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
        access: "public",
    });
    return blob.url;
}

export async function deletePhoto(id: string): Promise<void> {
    // Get the photo first to find blob URLs
    // Note: We can't easily delete from Vercel Blob without the full blob URL or token
    // and the del() function from @vercel/blob.
    // For now, we'll just remove the DB record as requested.
    // Ideally, we would track blob URLs and delete them here.
    const { error: fetchError } = await supabaseAdmin
        .from("photos")
        .select("*")
        .eq("id", id)
        .single();

    if (fetchError) {
        throw new Error(`Error finding photo to delete: ${fetchError.message}`);
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
        .from("photos")
        .delete()
        .eq("id", id);

    if (deleteError) {
        throw new Error(`Error deleting photo record: ${deleteError.message}`);
    }

    // Note: We can't easily delete from Vercel Blob without the full blob URL or token
    // and the del() function from @vercel/blob.
    // For now, we'll just remove the DB record as requested.
    // Ideally, we would track blob URLs and delete them here.
}

export async function addPhoto(photo: Photo): Promise<void> {
    const { aspectRatio, objectPosition, ...rest } = photo;
    const dbPhoto = {
        ...rest,
        aspect_ratio: aspectRatio,
        object_position: objectPosition,
        metadata: photo.metadata,
        video: photo.images.video,
    };

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

    // Define a type for the database row to replace 'any'
    type DbPhotoRow = {
        id: string;
        created_at: string;
        slug: string;
        title: string;
        description: string;
        date: string;
        location: string;
        url: string;
        aspect_ratio: string; // Changed to string as per Photo type
        object_position: string;
        metadata: Record<string, unknown>;
        video: string | null;
        images: {
            original: string;
            artStyles: ArtStyle[]; // Using unknown[] for now to avoid complex nested types
            [key: string]: unknown;
        };
    };

    return (data || []).map((row: DbPhotoRow) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        date: row.date,
        location: row.location,
        aspectRatio: row.aspect_ratio,
        objectPosition: row.object_position,
        metadata: row.metadata,
        images: {
            ...row.images,
            video: row.video || undefined,
        }
    }));
}
