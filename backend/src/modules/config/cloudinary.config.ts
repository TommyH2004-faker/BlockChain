// src/config/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

// Load .env nếu chưa được load
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'duhi7od89',
  api_key: process.env.CLOUDINARY_API_KEY || '489491828746492',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'bamHT41_EBSl189mlF76jub3k60'
});

export default cloudinary;
