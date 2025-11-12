"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const certificate_service_1 = require("./certificate.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const upload_service_1 = require("../../upload/upload.service");
let CertificateController = class CertificateController {
    constructor(certificateService, uploadService) {
        this.certificateService = certificateService;
        this.uploadService = uploadService;
    }
    async getAllCertificates(req) {
        try {
            console.log('Getting certificates for user:', {
                userId: req.user.userId,
                role: req.user.role
            });
            let certificates;
            if (req.user.role === 'admin') {
                certificates = await this.certificateService.findAll();
            }
            else if (req.user.role === 'issuer') {
                certificates = await this.certificateService.findByIssuer(req.user.userId);
            }
            else {
                certificates = await this.certificateService.findByRecipient(req.user.userId);
            }
            console.log(`Found ${certificates.length} certificates`);
            return certificates;
        }
        catch (error) {
            console.error('Error getting certificates:', error);
            throw new common_1.BadRequestException(`Failed to get certificates: ${error.message}`);
        }
    }
    async createTestCertificate(req) {
        try {
            console.log('Creating test certificate...');
            const testCertificate = {
                title: 'Test Certificate',
                description: 'Test Description',
                issuerId: req.user.userId,
                recipientId: req.user.userId,
                issueDate: new Date(),
                credentialID: `TEST-${Date.now()}`
            };
            console.log('Test certificate data:', testCertificate);
            const result = await this.certificateService.create(testCertificate);
            console.log('Test certificate created:', result);
            return result;
        }
        catch (error) {
            console.error('Error creating test certificate:', error);
            throw new common_1.BadRequestException(`Test failed: ${error.message}`);
        }
    }
    async getCertificateById(id) {
        return this.certificateService.findById(id);
    }
    async verify(id) {
        return this.certificateService.verifyCertificate(id);
    }
    async createCertificate(req, body, file) {
        try {
            console.log('=== CREATE CERTIFICATE ===');
            console.log('Body:', body);
            console.log('File:', file ? file.originalname : 'No file');
            console.log('User:', req.user);
            const certificateData = {
                credentialID: body.credentialID,
                title: body.title,
                description: body.description,
                grade: body.grade,
                type: body.type,
                issueDate: body.issueDate,
                recipientId: body.recipientId,
            };
            if (!certificateData.title) {
                throw new common_1.BadRequestException('Title is required');
            }
            if (!certificateData.recipientId) {
                throw new common_1.BadRequestException('Recipient ID is required');
            }
            if (!certificateData.credentialID) {
                throw new common_1.BadRequestException('Credential ID is required');
            }
            let imageUrl = null;
            if (file) {
                console.log('📤 Uploading image to Cloudinary...');
                const uploadResult = await this.uploadService.uploadImage(file);
                imageUrl = uploadResult.secure_url;
                console.log('✅ Image uploaded:', imageUrl);
            }
            const certificate = await this.certificateService.create({
                ...certificateData,
                image: imageUrl,
                issuerId: req.user.userId
            });
            console.log('✅ Certificate created:', certificate.id);
            return certificate;
        }
        catch (error) {
            console.error('❌ Create certificate error:', error);
            throw new common_1.BadRequestException(`Failed to create certificate: ${error.message}`);
        }
    }
    async getBlockchainCertificates() {
        try {
            console.log('Fetching all blockchain certificates...');
            const certificates = await this.certificateService.getAllBlockchainCertificates();
            console.log(`Found ${certificates.length} blockchain certificates`);
            return certificates;
        }
        catch (error) {
            console.error('Error fetching blockchain certificates:', error);
            throw new common_1.BadRequestException(`Failed to fetch blockchain certificates: ${error.message}`);
        }
    }
    async issueOnBlockchain(body) {
        try {
            console.log('Received blockchain issuance request for cert ID:', body.certId);
            const certificate = await this.certificateService.findById(body.certId);
            if (!certificate) {
                throw new common_1.BadRequestException('Certificate not found');
            }
            if (!certificate.title || !certificate.description) {
                throw new common_1.BadRequestException('Certificate must have title and description');
            }
            const result = await this.certificateService.issueOnBlockchain(body.certId);
            if (!result || !result.certificateId) {
                throw new common_1.BadRequestException('No certificate ID returned from blockchain');
            }
            console.log('Successfully issued certificate on blockchain:', result);
            return {
                success: true,
                message: 'Certificate issued on blockchain successfully',
                certificateId: result.certificateId,
                transactionHash: result.transactionHash || result.certificateId
            };
        }
        catch (error) {
            console.error('Error issuing certificate on blockchain:', error);
            throw new common_1.BadRequestException(`Failed to issue on blockchain: ${error.message}`);
        }
    }
    async updateCertificate(req, id, certificateData) {
        const certificate = await this.certificateService.findById(id);
        if (!certificate) {
            throw new common_1.NotFoundException('Certificate not found');
        }
        if (req.user.role !== 'admin' && certificate.issuerId !== req.user.userId) {
            throw new common_1.ForbiddenException('Không có quyền cập nhật chứng chỉ');
        }
        delete certificateData.issuerId;
        delete certificateData.recipientId;
        delete certificateData.issuer;
        delete certificateData.recipient;
        delete certificateData.blockchainVerified;
        delete certificateData.blockchainTxId;
        delete certificateData.createdAt;
        delete certificateData.updatedAt;
        const updated = await this.certificateService.update(id, certificateData);
        return {
            message: 'Cập nhật thành công',
            certificate: updated,
        };
    }
    async deleteCertificate(req, id) {
        const certificate = await this.certificateService.findById(id);
        if (req.user.role !== 'admin' && certificate.issuerId !== req.user.userId) {
            throw new common_1.BadRequestException('Không có quyền xóa chứng chỉ');
        }
        return this.certificateService.remove(id);
    }
    async uploadImage(req, id, file) {
        const certificate = await this.certificateService.findById(id);
        if (req.user.role !== 'admin' && certificate.issuerId !== req.user.userId) {
            throw new common_1.BadRequestException('Không có quyền cập nhật ảnh chứng chỉ');
        }
        if (!file) {
            throw new common_1.BadRequestException('Không tìm thấy file ảnh');
        }
        const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return this.certificateService.updateImage(id, imageBase64);
    }
    async searchCertificates(query) {
        if (!query) {
            return [];
        }
        return this.certificateService.search(query);
    }
    async getBlockchainCertificate(txId) {
        try {
            const cert = await this.certificateService.getBlockchainCertificate(txId);
            return cert;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Lỗi khi lấy chứng chỉ từ blockchain: ${error.message}`);
        }
    }
    async verifyCertificateByTx(txId, req) {
        const user = req.user;
        console.log(`[VERIFY] User ${user.username} (${user.role}) requested verification for txId: ${txId}`);
        try {
            const cert = await this.certificateService.findByBlockchainTxId(txId);
            if (!cert) {
                console.warn(`[VERIFY] Certificate not found for txId: ${txId}`);
                throw new common_1.NotFoundException('Certificate not found');
            }
            if (user.role !== 'admin' && user.role !== 'issuer') {
                console.warn(`[VERIFY] User ${user.username} (${user.role}) is not allowed to verify certificate ID ${cert.id}`);
                throw new common_1.ForbiddenException('You are not allowed to verify this certificate');
            }
            if (cert.blockchainVerified) {
                console.log(`[VERIFY] Certificate ID ${cert.id} already verified`);
                return { certificate: cert, message: 'Certificate has already been verified', verified: true };
            }
            const issueDate = new Date(cert.issueDate);
            const expiryDate = new Date(issueDate);
            expiryDate.setFullYear(issueDate.getFullYear() + 5);
            cert.blockchainVerified = true;
            cert.expiryDate = expiryDate;
            await this.certificateService.updateCertificate(cert.id, {
                blockchainVerified: true,
                expiryDate: cert.expiryDate,
            });
            console.log(`[VERIFY] Certificate ID ${cert.id} verified successfully`);
            return { certificate: cert, message: 'Certificate successfully verified', verified: true };
        }
        catch (error) {
            console.error(`[VERIFY] Error verifying certificate txId ${txId}:`, error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to verify certificate');
        }
    }
};
exports.CertificateController = CertificateController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "getAllCertificates", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "createTestCertificate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "getCertificateById", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "verify", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "createCertificate", null);
__decorate([
    (0, common_1.Get)('blockchain'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "getBlockchainCertificates", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('blockchain/issue'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "issueOnBlockchain", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "updateCertificate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "deleteCertificate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload-image/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "searchCertificates", null);
__decorate([
    (0, common_1.Get)('blockchain/:txId'),
    __param(0, (0, common_1.Param)('txId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "getBlockchainCertificate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('verify/blockchain/:txId'),
    __param(0, (0, common_1.Param)('txId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "verifyCertificateByTx", null);
exports.CertificateController = CertificateController = __decorate([
    (0, common_1.Controller)('certificates'),
    __metadata("design:paramtypes", [certificate_service_1.CertificateService,
        upload_service_1.UploadService])
], CertificateController);
//# sourceMappingURL=certificate.controller.js.map