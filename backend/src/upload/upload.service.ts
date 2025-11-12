import { Injectable, BadRequestException } from '@nestjs/common';

import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../modules/config/cloudinary.config';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    try {
      console.log('📤 Uploading image to Cloudinary:', file.originalname);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'certificates',
            resource_type: 'image',
            transformation: [
              { width: 1000, height: 1414, crop: 'limit' }, // A4 ratio
              { quality: 'auto:good' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('✅ Upload successful:', result.secure_url);
              resolve(result);
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new BadRequestException('Failed to upload image');
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log('🗑️ Image deleted from Cloudinary:', publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    }
  }
}