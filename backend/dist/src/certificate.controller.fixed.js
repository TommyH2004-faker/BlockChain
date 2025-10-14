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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const certificate_onchain_service_1 = require("./certificate.onchain.service");
const certificate_service_1 = require("./certificate.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let CertificateController = class CertificateController {
    constructor(certOnChainService, certificateService) {
        this.certOnChainService = certOnChainService;
        this.certificateService = certificateService;
    }
    async getAllCertificates(req) {
        console.log('GET /certificates - User:', req.user);
        if (req.user.role === 'admin') {
            console.log('Admin access - returning all certificates');
            return this.certificateService.findAll();
        }
        else if (req.user.role === 'issuer') {
            console.log('Issuer access - returning issued certificates for:', req.user.userId);
            return this.certificateService.findByIssuer(req.user.userId);
        }
        else {
            console.log('User access - returning received certificates for:', req.user.userId);
            return this.certificateService.findByRecipient(req.user.userId);
        }
    }
    async getCertificateById(id) {
        return this.certificateService.findById(id);
    }
    async verifyCertificate(credentialID) {
        try {
            const certificate = await this.certificateService.findByCredentialID(credentialID);
            const verificationDetails = {
                databaseVerified: true,
                certificateExists: true,
                verificationTime: new Date().toISOString()
            };
            const result = {
                certificate,
                verified: true,
                blockchainVerified: false,
                blockchainData: null,
                verificationDetails
            };
            if (certificate.blockchainTxId) {
                try {
                    const onchainData = await this.certOnChainService.getCertificate(certificate.blockchainTxId);
                    const titleMatches = onchainData.title === certificate.title;
                    const descriptionMatches = onchainData.description === certificate.description;
                    const dateMatches = onchainData.issueDate === certificate.issueDate;
                    result.blockchainVerified = titleMatches && descriptionMatches && dateMatches;
                    result.blockchainData = onchainData;
                    result.verificationDetails.blockchainVerified = result.blockchainVerified;
                    result.verificationDetails.blockchainTxId = certificate.blockchainTxId;
                    result.verificationDetails.dataMatches = {
                        title: titleMatches,
                        description: descriptionMatches,
                        date: dateMatches
                    };
                    await this.certificateService.update(certificate.id, {
                        blockchainVerified: result.blockchainVerified
                    });
                }
                catch (error) {
                    result.blockchainVerified = false;
                    result.verificationDetails.blockchainError = error.message;
                }
            }
            return result;
        }
        catch (error) {
            const errorResult = {
                verified: false,
                certificateExists: false,
                error: 'Không tìm thấy chứng chỉ',
                errorDetails: error.message,
                verificationDetails: {
                    databaseVerified: false,
                    certificateExists: false,
                    verificationTime: new Date().toISOString(),
                    blockchainError: 'Certificate not found in database'
                }
            };
            return errorResult;
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
    async issueOnBlockchain(req, body) {
        const certificate = await this.certificateService.findById(body.certId);
        if (req.user.role !== 'admin' && certificate.issuerId !== req.user.userId) {
            throw new common_1.BadRequestException('Không có quyền lưu chứng chỉ này lên blockchain');
        }
        if (certificate.blockchainTxId) {
            return {
                message: 'Chứng chỉ đã được lưu trên blockchain',
                blockchainTxId: certificate.blockchainTxId,
                certificate: certificate
            };
        }
        try {
            const recipientIdentifier = certificate.recipient?.username ||
                certificate.recipientId ||
                'unknown-recipient';
            const blockchainTxId = await this.certOnChainService.issueCertificate(recipientIdentifier, certificate.title, certificate.description, certificate.issueDate);
            const updatedCert = await this.certificateService.update(body.certId, {
                blockchainTxId,
                blockchainVerified: true
            });
            return {
                message: 'Chứng chỉ đã được lưu trên blockchain thành công',
                certificate: updatedCert,
                blockchainTxId
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Lỗi khi lưu chứng chỉ lên blockchain: ${error.message}`);
        }
    }
    async getBlockchainCertificate(txId) {
        try {
            const cert = await this.certOnChainService.getCertificate(txId);
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
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
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
    __metadata("design:paramtypes", [typeof (_a = typeof certificate_onchain_service_1.CertificateOnChainService !== "undefined" && certificate_onchain_service_1.CertificateOnChainService) === "function" ? _a : Object, certificate_service_1.CertificateService])
], CertificateController);
//# sourceMappingURL=certificate.controller.fixed.js.map