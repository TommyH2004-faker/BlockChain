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
exports.CertificateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const certificate_entity_1 = require("../../common/entities/certificate.entity");
const user_entity_1 = require("../../common/entities/user.entity");
const certificate_onchain_service_1 = require("../blockchain/certificate.onchain.service");
let CertificateService = class CertificateService {
    constructor(certificateRepository, userRepository, certificateOnChainService) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.certificateOnChainService = certificateOnChainService;
    }
    async findAll() {
        try {
            return await this.certificateRepository.find({
                relations: ['issuer', 'recipient']
            });
        }
        catch (error) {
            console.error('Error finding all certificates:', error);
            return [];
        }
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
        const newCertificate = this.certificateRepository.create({
            ...certificateData,
            issuerId,
            recipientId,
            blockchainTxId,
        });
        return this.certificateRepository.save(newCertificate);
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
    async verifyCertificate(certificate) {
        if (certificate.blockchainTxId) {
            try {
                const onchainData = await this.certificateOnChainService.getCertificate(certificate.blockchainTxId);
                return {
                    certificate,
                    verified: true,
                    blockchainData: onchainData
                };
            }
            catch (error) {
                return {
                    certificate,
                    verified: false,
                    error: 'Không thể xác minh trên blockchain'
                };
            }
        }
        return {
            certificate,
            verified: true
        };
    }
    async issueOnBlockchain(certId) {
        try {
            console.log(`Processing blockchain issuance for certificate ${certId}`);
            const certificate = await this.findById(certId);
            if (!certificate) {
                throw new Error(`Certificate with ID ${certId} not found`);
            }
            console.log(`Found certificate: ${certificate.title}`);
            const issueDate = certificate.issueDate
                ? new Date(certificate.issueDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];
            const blockchainId = await this.certificateOnChainService.issueCertificate(certificate.recipient?.username || 'unknown-recipient', certificate.title, certificate.description || '', issueDate);
            if (!blockchainId) {
                throw new Error('No blockchain ID returned from transaction');
            }
            console.log(`Certificate issued on blockchain with ID: ${blockchainId}`);
            await this.certificateRepository.update(certId, {
                blockchainTxId: blockchainId
            });
            return {
                success: true,
                message: 'Certificate issued on blockchain successfully',
                certificateId: blockchainId,
                transactionHash: blockchainId
            };
        }
        catch (error) {
            console.error(`Error issuing certificate ${certId} on blockchain:`, error);
            throw error;
        }
    }
    async getBlockchainCertificate(txId) {
        try {
            const onChainService = new certificate_onchain_service_1.CertificateOnChainService();
            return await onChainService.getCertificate(txId);
        }
        catch (error) {
            console.error(`Error getting certificate ${txId} from blockchain:`, error);
            return {
                issuer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                recipient: "Unknown",
                title: "Certificate Record",
                description: "Error retrieving certificate: " + error.message,
                issueDate: new Date().toISOString().split('T')[0],
                verifiedAt: new Date().toISOString(),
                error: error.message
            };
        }
    }
};
exports.CertificateService = CertificateService;
exports.CertificateService = CertificateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        certificate_onchain_service_1.CertificateOnChainService])
], CertificateService);
//# sourceMappingURL=certificate.service.js.map