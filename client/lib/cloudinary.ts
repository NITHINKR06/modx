const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/** Allowed MIME types for project images */
const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);

/** Max upload size: 10 MB */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * Validates file type and size before uploading.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
    // --- Client-side guards (defense in depth) ---
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        throw new Error(
            `File type "${file.type}" is not allowed. Please upload a JPEG, PNG, WebP, GIF, or AVIF image.`
        );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        throw new Error(
            `File is too large (${sizeMB} MB). Maximum allowed size is 10 MB.`
        );
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || "Cloudinary upload failed");
    }

    const data = await response.json();
    return data.secure_url as string;
}
