/**
 * Utility functions for image compression and optimization
 */

/**
 * Compresses an image file to reduce its size
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width in pixels
 * @param {number} options.maxHeight - Maximum height in pixels
 * @param {number} options.quality - JPEG quality (0-1)
 * @param {boolean} options.useWebWorker - Whether to use a web worker for compression
 * @returns {Promise<Blob>} - Compressed image as a Blob
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    useWebWorker = false
  } = options;
  
  // Check if the file is already small enough (under 100KB)
  if (file.size < 100 * 1024) {
    return file;
  }
  
  // Use browser-image-compression library if available and web worker is requested
  if (useWebWorker && typeof window !== 'undefined' && 'Worker' in window) {
    try {
      // Try to dynamically import the browser-image-compression library
      // This is just a placeholder - in a real app you would need to install this package
      // const imageCompression = await import('browser-image-compression');
      // return imageCompression.default(file, {
      //   maxSizeMB: 1,
      //   maxWidthOrHeight: Math.max(maxWidth, maxHeight),
      //   useWebWorker: true,
      //   initialQuality: quality
      // });
      
      // Since we can't actually import the library in this environment,
      // fall back to the standard implementation
      return standardCompression(file, { maxWidth, maxHeight, quality });
    } catch (error) {
      console.warn('Web worker compression failed, falling back to standard compression', error);
      return standardCompression(file, { maxWidth, maxHeight, quality });
    }
  }
  
  // Use standard compression
  return standardCompression(file, { maxWidth, maxHeight, quality });
};

/**
 * Standard image compression implementation
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Blob>} - Compressed image as a Blob
 */
const standardCompression = (file, options) => {
  const { maxWidth, maxHeight, quality } = options;
  
  return new Promise((resolve, reject) => {
    // Create a FileReader to read the file
    const reader = new FileReader();
    
    // Set up FileReader onload handler
    reader.onload = (readerEvent) => {
      // Create an image object
      const img = new Image();
      
      // Set up image onload handler
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Skip compression if the image is already small enough
        if (width === img.width && height === img.height && quality >= 0.9) {
          fetch(readerEvent.target.result)
            .then(res => res.blob())
            .then(resolve)
            .catch(reject);
          return;
        }
        
        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };
      
      // Set up image error handler
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // Set image source to FileReader result
      img.src = readerEvent.target.result;
    };
    
    // Set up FileReader error handler
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a thumbnail from an image file
 * @param {File} file - The image file
 * @param {number} size - Thumbnail size in pixels
 * @returns {Promise<string>} - Thumbnail data URL
 */
export const createThumbnail = async (file, size = 120) => {
  const blob = await compressImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7
  });
  
  return URL.createObjectURL(blob);
};

/**
 * Revokes object URLs to prevent memory leaks
 * @param {string} url - Object URL to revoke
 */
export const revokeObjectURL = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};