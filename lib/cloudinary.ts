import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary
 * @param buffer - The file buffer
 * @param folder - The target folder in Cloudinary
 * @returns The secure URL of the uploaded image
 */
export async function uploadImageToCloudinary(buffer: Buffer, folder: string = 'ananda-travel/general'): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Failed to get secure URL from Cloudinary'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Extracts the public ID from a Cloudinary secure URL and deletes the image.
 * If the URL is not a valid Cloudinary URL, it ignores it.
 * @param url - The Cloudinary secure URL
 */
export async function deleteImageFromCloudinary(url: string | undefined | null): Promise<void> {
  if (!url || typeof url !== 'string') return;
  
  // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/ananda-travel/packages/abcd.jpg
  // The public ID includes the folder path but excludes the version and extension.
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    console.log('Skipping deletion: Not a valid Cloudinary URL', url);
    return;
  }

  try {
    const urlParts = url.split('/upload/');
    const pathAfterUpload = urlParts[1];
    
    // Path looks like 'v1234567890/ananda-travel/packages/abcd.jpg' or 'ananda-travel/packages/abcd.jpg'
    const pathParts = pathAfterUpload.split('/');
    if (pathParts[0].match(/^v\d+$/)) {
      pathParts.shift();
    }
    
    const pathWithoutVersion = pathParts.join('/');
    
    // Remove the file extension if it exists
    const lastDotIndex = pathWithoutVersion.lastIndexOf('.');
    const publicId = lastDotIndex !== -1 
      ? pathWithoutVersion.substring(0, lastDotIndex) 
      : pathWithoutVersion;
    
    if (publicId) {
      console.log(`Deleting Cloudinary image with public ID: ${publicId}`);
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
  }
}
