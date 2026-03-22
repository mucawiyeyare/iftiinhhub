/**
 * Simple Cloudinary upload without requiring custom upload preset
 * This uses a more basic approach that should work immediately
 */

const CLOUDINARY_CLOUD_NAME = 'dhvejk37j';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload image to Cloudinary using unsigned upload
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - Returns the uploaded image URL
 */
export const uploadImageSimple = async (file) => {
  try {
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image size must be less than 10MB');
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Cloudinary's default unsigned preset
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    // Upload to Cloudinary
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
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
 * Create a Cloudinary transformation URL
 * @param {string} imageUrl - Original Cloudinary image URL
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed image URL
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl; // Return original if not a Cloudinary URL
  }

  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    width: 800,
    height: 600,
    crop: 'fill',
    ...options
  };

  // Build transformation string
  const transformations = Object.entries(defaultOptions)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  // Insert transformations into the URL
  return imageUrl.replace('/upload/', `/upload/${transformations}/`);
};