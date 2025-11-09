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
            console.log('Attempting to fetch all certificates from database...');
            if (!this.certificateRepository) {
                console.error('Certificate repository is not properly injected');
                throw new Error('Database connection error');
            }
            const certificates = await this.certificateRepository.find({
                relations: ['issuer', 'recipient']
            });
            console.log('Database query result:', {
                success: true,
                count: certificates.length,
                certificates: certificates.map(c => ({
                    id: c.id,
                    title: c.title,
                    issuerId: c.issuerId,
                    recipientId: c.recipientId
                }))
            });
            return certificates;
        }
        catch (error) {
            console.error('Error in findAll certificates:', error);
            throw new Error(`Database error: ${error.message}`);
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
    async create(certificateData) {
        try {
            const certificate = this.certificateRepository.create(certificateData);
            return await this.certificateRepository.save(certificate);
        }
        catch (error) {
            console.error('Error creating certificate:', error);
            throw new common_1.BadRequestException(`Database error: ${error.message}`);
        }
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
    async issueOnBlockchain(certId) {
        try {
            console.log(`Processing blockchain issuance for certificate ${certId}`);
            const certificate = await this.findById(certId);
            if (!certificate) {
                throw new Error(`Certificate with ID ${certId} not found`);
            }
            const issueDate = certificate.issueDate
                ? new Date(certificate.issueDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];
            const blockchainResponse = await this.certificateOnChainService.issueCertificate(certificate.recipient?.username || 'unknown-recipient', certificate.title, certificate.description || '', issueDate);
            const txHash = typeof blockchainResponse === 'string'
                ? blockchainResponse
                : blockchainResponse.transactionHash;
            if (!txHash)
                throw new Error('Blockchain transaction hash not found');
            console.log(`✅ Certificate issued on blockchain with txHash: ${txHash}`);
            await this.certificateRepository.update(certId, {
                blockchainTxId: txHash,
            });
            return {
                success: true,
                message: 'Certificate issued on blockchain successfully',
                certificateId: certId,
                transactionHash: txHash,
            };
        }
        catch (error) {
            console.error(`❌ Error issuing certificate ${certId} on blockchain:`, error);
            throw new Error(`Lỗi blockchain: Failed to issue on blockchain: ${error.message}`);
        }
    }
    async getAllBlockchainCertificates() {
        try {
            const certificates = await this.certificateRepository.find({
                where: {
                    blockchainTxId: (0, typeorm_2.Not)((0, typeorm_2.IsNull)())
                },
                relations: ['issuer', 'recipient']
            });
            const blockchainCertificates = await Promise.all(certificates.map(async (cert) => {
                try {
                    const blockchainData = await this.certificateOnChainService.getCertificate(cert.blockchainTxId);
                    return {
                        id: cert.id,
                        title: cert.title,
                        description: cert.description,
                        issueDate: cert.issueDate,
                        issuer: {
                            id: cert.issuer.id,
                            username: cert.issuer.username,
                            blockchainAddress: blockchainData.issuer
                        },
                        recipient: {
                            id: cert.recipient.id,
                            username: cert.recipient.username,
                            blockchainAddress: blockchainData.recipient
                        },
                        blockchainTxId: cert.blockchainTxId,
                        blockchainData: {
                            status: blockchainData.status || 'VERIFIED',
                            issueDate: blockchainData.issueDate,
                            title: blockchainData.title,
                            transactionHash: blockchainData.transactionHash,
                            blockNumber: blockchainData.blockNumber
                        }
                    };
                }
                catch (error) {
                    console.error(`Error fetching blockchain data for certificate ${cert.id}:`, error);
                    return {
                        ...cert,
                        blockchainError: error.message
                    };
                }
            }));
            return blockchainCertificates;
        }
        catch (error) {
            console.error('Error in getAllBlockchainCertificates:', error);
            throw new Error(`Failed to fetch blockchain certificates: ${error.message}`);
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
    async verifyCertificate(certIdOrTx) {
        const cert = await this.certificateRepository.findOne({
            where: [
                { credentialID: certIdOrTx },
                { blockchainTxId: certIdOrTx },
            ],
        });
        if (!cert)
            return { verified: false };
        return {
            verified: true,
            data: cert,
        };
    }
    async findByBlockchainTxId(txId) {
        return this.certificateRepository.findOne({ where: { blockchainTxId: txId } });
    }
    async updateCertificate(id, updateData) {
        const cert = await this.findById(id);
        if (!cert) {
            throw new common_1.NotFoundException(`Certificate with id ${id} not found`);
        }
        const updatedCert = this.certificateRepository.merge(cert, updateData);
        return this.certificateRepository.save(updatedCert);
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