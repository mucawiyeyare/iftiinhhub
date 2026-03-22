import { cloudinaryUploadUrl, uploadPreset } from '../config/cloudinary';

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<string>} - Returns the uploaded image URL
 */
export const uploadImageToCloudinary = async (file, onProgress = null) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Image size should be less than 10MB');
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'codehub/courses'); // Organize uploads in folders
    formData.append('resource_type', 'image');

    // Upload to Cloudinary
    const response = await fetch(cloudinaryUploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Return the secure URL
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Generate Cloudinary transformation URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Transformation options
 * @returns {string} - Transformed image URL
 */
export const getTransformedImageUrl = (publicId, transformations = {}) => {
  const baseUrl = `https://res.cloudinary.com/dpuanuspp/image/upload`;
  
  // Default transformations
  const defaultTransforms = {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations
  };

  // Build transformation string
  const transformString = Object.entries(defaultTransforms)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  return `${baseUrl}/${transformString}/${publicId}`;
};