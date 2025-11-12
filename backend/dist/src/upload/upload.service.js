"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_config_1 = __importDefault(require("../modules/config/cloudinary.config"));
let UploadService = class UploadService {
    async uploadImage(file) {
        try {
            console.log('📤 Uploading image to Cloudinary:', file.originalname);
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_config_1.default.uploader.upload_stream({
                    folder: 'certificates',
                    resource_type: 'image',
                    transformation: [
                        { width: 1000, height: 1414, crop: 'limit' },
                        { quality: 'auto:good' }
                    ]
                }, (error, result) => {
                    if (error) {
                        console.error('❌ Cloudinary upload error:', error);
                        reject(error);
                    }
                    else {
                        console.log('✅ Upload successful:', result.secure_url);
                        resolve(result);
                    }
                });
                uploadStream.end(file.buffer);
            });
        }
        catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new common_1.BadRequestException('Failed to upload image');
        }
    }
    async deleteImage(publicId) {
        try {
            await cloudinary_config_1.default.uploader.destroy(publicId);
            console.log('🗑️ Image deleted from Cloudinary:', publicId);
        }
        catch (error) {
            console.error('Error deleting from Cloudinary:', error);
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map