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
exports.CertificateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const certificate_entity_1 = require("./entities/certificate.entity");
const user_entity_1 = require("./entities/user.entity");
const certificate_onchain_service_1 = require("./certificate.onchain.service");
let CertificateService = class CertificateService {
    constructor(certificateRepository, userRepository, certificateOnChainService) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.certificateOnChainService = certificateOnChainService;
    }
    async findAll() {
        return this.certificateRepository.find({
            relations: ['issuer', 'recipient']
        });
    }
    async findByIssuer(issuerId) {
        return this.certificateRepository.find({
            where: { issuerId },
            relations: ['issuer', 'recipient']
        });
    }
    async findByRecipient(recipientId) {
        return this.certificateRepository.find({
            where: { recipientId },
            relations: ['issuer', 'recipient']
        });
    }
    async findById(id) {
        const certificate = await this.certificateRepository.findOne({
            where: { id },
            relations: ['issuer', 'recipient']
        });
        if (!certificate) {
            throw new common_1.NotFoundException(`Certificate with ID ${id} not found`);
        }
        return certificate;
    }
    async findByCredentialID(credentialID) {
        const certificate = await this.certificateRepository.findOne({
            where: { credentialID },
            relations: ['issuer', 'recipient']
        });
        if (!certificate) {
            throw new common_1.NotFoundException(`Certificate with credential ID ${credentialID} not found`);
        }
        return certificate;
    }
    async create(certificateData, issuerId, recipientId) {
        const issuer = await this.userRepository.findOneBy({ id: issuerId });
        const recipient = await this.userRepository.findOneBy({ id: recipientId });
        if (!issuer || !recipient) {
            throw new common_1.NotFoundException('Issuer or recipient not found');
        }
        let blockchainTxId = null;
        try {
            blockchainTxId = await this.certificateOnChainService.issueCertificate(recipient.username, certificateData.title, certificateData.description, certificateData.issueDate);
        }
        catch (error) {
            console.error('Failed to issue certificate on blockchain:', error);
        }
        const certificate = new certificate_entity_1.Certificate();
        Object.assign(certificate, {
            ...certificateData,
            issuerId,
            recipientId,
            blockchainTxId
        });
        const savedCertificate = await this.certificateRepository.save(certificate);
        return this.findById(savedCertificate.id);
    }
    async update(id, certificateData) {
        await this.findById(id);
        await this.certificateRepository.update(id, certificateData);
        return this.findById(id);
    }
    async updateImage(id, imageUrl) {
        const certificate = await this.findById(id);
        certificate.image = imageUrl;
        return this.certificateRepository.save(certificate);
    }
    async remove(id) {
        const certificate = await this.findById(id);
        await this.certificateRepository.remove(certificate);
    }
    async search(query) {
        return this.certificateRepository
            .createQueryBuilder('certificate')
            .leftJoinAndSelect('certificate.issuer', 'issuer')
            .leftJoinAndSelect('certificate.recipient', 'recipient')
            .where('certificate.title LIKE :query', { query: `%${query}%` })
            .orWhere('certificate.description LIKE :query', { query: `%${query}%` })
            .orWhere('certificate.credentialID LIKE :query', { query: `%${query}%` })
            .getMany();
    }
};
exports.CertificateService = CertificateService;
exports.CertificateService = CertificateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, typeof (_a = typeof certificate_onchain_service_1.CertificateOnChainService !== "undefined" && certificate_onchain_service_1.CertificateOnChainService) === "function" ? _a : Object])
], CertificateService);
//# sourceMappingURL=certificate.service.js.map