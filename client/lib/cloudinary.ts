const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
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
