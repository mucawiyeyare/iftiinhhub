// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dhvejk37j',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '964824766531758',
};

// Upload preset for unsigned uploads (using your existing preset)
// Your preset 'car_listing_sites' should already be configured as unsigned
export const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'car_listing_sites';

// Cloudinary upload URL
export const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;