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
let CertificateController = class CertificateController {
    constructor(certificateService) {
        this.certificateService = certificateService;
    }
    async getAllCertificates(req) {
        try {
            console.log('Getting all certificates...');
            if (req.user.role === 'admin') {
                const certificates = await this.certificateService.findAll();
                return certificates;
            }
            if (req.user.role === 'issuer') {
                return await this.certificateService.findByIssuer(req.user.id);
            }
            return await this.certificateService.findByRecipient(req.user.id);
        }
        catch (error) {
            console.error('Error in getAllCertificates:', error);
            return [];
        }
    }
    async getCertificateById(id) {
        return this.certificateService.findById(id);
    }
    async verifyCertificate(credentialID) {
        try {
            const certificate = await this.certificateService.findByCredentialID(credentialID);
            return this.certificateService.verifyCertificate(certificate);
        }
        catch (error) {
            return {
                verified: false,
                error: 'Không tìm thấy chứng chỉ'
            };
        }
    }
    async createCertificate(req, certificateData) {
        if (req.user.role !== 'admin' && req.user.role !== 'issuer') {
            throw new common_1.BadRequestException('Không có quyền tạo chứng chỉ');
        }
        if (!certificateData.credentialID) {
            certificateData.credentialID = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
        return this.certificateService.create(certificateData, req.user.userId, certificateData.recipientId);
    }
    async updateCertificate(req, id, certificateData) {
        const certificate = await this.certificateService.findById(id);
        if (req.user.role !== 'admin' && certificate.issuerId !== req.user.userId) {
            throw new common_1.BadRequestException('Không có quyền cập nhật chứng chỉ');
        }
        return this.certificateService.update(id, certificateData);
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
    async issueOnBlockchain(body) {
        try {
            console.log('Received blockchain issuance request for cert ID:', body.certId);
            const result = await this.certificateService.issueOnBlockchain(body.certId);
            if (!result || !result.certificateId) {
                console.error('No certificate ID returned from blockchain service');
                throw new common_1.BadRequestException('Không nhận được ID giao dịch từ blockchain');
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
            throw new common_1.BadRequestException(`Lỗi khi lưu chứng chỉ lên blockchain: ${error.message}`);
        }
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
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "getCertificateById", null);
__decorate([
    (0, common_1.Get)('verify/:credentialID'),
    __param(0, (0, common_1.Param)('credentialID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "verifyCertificate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "createCertificate", null);
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('blockchain/issue'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "issueOnBlockchain", null);
__decorate([
    (0, common_1.Get)('blockchain/:txId'),
    __param(0, (0, common_1.Param)('txId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "getBlockchainCertificate", null);
exports.CertificateController = CertificateController = __decorate([
    (0, common_1.Controller)('certificates'),
    __metadata("design:paramtypes", [certificate_service_1.CertificateService])
], CertificateController);
//# sourceMappingURL=certificate.controller.js.map