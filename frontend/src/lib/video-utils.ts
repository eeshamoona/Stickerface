export async function extractFrameFromVideo(videoFile: File, timeInSeconds: number = 0): Promise<File> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(videoFile);
        video.muted = true;
        video.playsInline = true;
        video.currentTime = timeInSeconds;

        video.onloadeddata = () => {
            // Wait for seek to complete if we set currentTime
            if (timeInSeconds > 0) {
                video.currentTime = timeInSeconds;
            } else {
                capture();
            }
        };

        video.onseeked = () => {
            capture();
        };

        video.onerror = () => {
            reject(new Error("Failed to load video"));
        };

        function capture() {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const imageFile = new File([blob], `frame-${timeInSeconds}.jpg`, { type: "image/jpeg" });
                    resolve(imageFile);
                    URL.revokeObjectURL(video.src);
                } else {
                    reject(new Error("Failed to create blob from canvas"));
                }
            }, "image/jpeg", 0.95);
        }
    });
}

export async function generateVideoThumbnails(videoFile: File, count: number = 5): Promise<File[]> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(videoFile);
        video.muted = true;
        video.playsInline = true;

        video.onloadedmetadata = async () => {
            const duration = video.duration;
            const interval = duration / (count + 1);
            const thumbnails: File[] = [];

            try {
                for (let i = 1; i <= count; i++) {
                    const time = interval * i;
                    const file = await extractFrameFromVideo(videoFile, time);
                    thumbnails.push(file);
                }
                resolve(thumbnails);
            } catch (error) {
                reject(error);
            } finally {
                URL.revokeObjectURL(video.src);
            }
        };

        video.onerror = () => {
            reject(new Error("Failed to load video metadata"));
        };
    });
}
