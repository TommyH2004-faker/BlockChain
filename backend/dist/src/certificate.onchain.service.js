"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateOnChainService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const certificate_address_1 = require("./certificate.address");
const contractJson = __importStar(require("../artifacts/contracts/Certificate.sol/Certificate.json"));
let CertificateOnChainService = class CertificateOnChainService {
    constructor() {
        try {
            console.log('Initializing blockchain service...');
            const networkConfig = {
                name: 'hardhat',
                chainId: 31337,
                ensAddress: null,
            };
            this.provider = new ethers_1.ethers.providers.JsonRpcProvider('http://127.0.0.1:8545', networkConfig);
            console.log('Provider initialized with explicit network config, connecting to local Hardhat node');
            const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
            this.signer = new ethers_1.ethers.Wallet(privateKey, this.provider);
            console.log('Signer initialized with address:', this.signer.address);
            if (!ethers_1.ethers.utils.isAddress(certificate_address_1.CERTIFICATE_CONTRACT_ADDRESS)) {
                console.error('Invalid contract address:', certificate_address_1.CERTIFICATE_CONTRACT_ADDRESS);
                throw new Error(`Invalid contract address: ${certificate_address_1.CERTIFICATE_CONTRACT_ADDRESS}`);
            }
            else {
                console.log('Using contract at address:', certificate_address_1.CERTIFICATE_CONTRACT_ADDRESS);
            }
            this.contract = new ethers_1.ethers.Contract(certificate_address_1.CERTIFICATE_CONTRACT_ADDRESS, contractJson.abi, this.signer);
            this.testContractConnection();
            console.log('Contract interface initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize blockchain service:', error);
            throw new Error(`Blockchain initialization failed: ${error.message}`);
        }
    }
    async testContractConnection() {
        try {
            const count = await this.contract.certCount();
            console.log('Successfully connected to contract. Current certificate count:', count.toString());
        }
        catch (error) {
            console.error('Failed to connect to contract:', error);
            throw new Error(`Contract connection test failed: ${error.message}`);
        }
    }
    async issueCertificate(recipient, title, description, issueDate) {
        try {
            console.log('Attempting to issue certificate on blockchain for recipient:', recipient);
            let recipientAddress;
            if (!recipient || recipient === 'unknown-recipient') {
                recipientAddress = this.signer.address;
                console.log('Using default recipient address (signer):', recipientAddress);
            }
            else if (!ethers_1.ethers.utils.isAddress(recipient)) {
                const hash = ethers_1.ethers.utils.id(recipient);
                recipientAddress = ethers_1.ethers.utils.getAddress('0x' + hash.slice(2, 42));
                console.log('Generated address from recipient string:', recipientAddress);
            }
            else {
                recipientAddress = recipient;
                console.log('Using provided recipient address:', recipientAddress);
            }
            try {
                const gasEstimate = await this.contract.estimateGas.issueCertificate(recipientAddress, title, description, issueDate);
                console.log('Gas estimation successful, required gas:', gasEstimate.toString());
            }
            catch (gasError) {
                console.error('Gas estimation failed:', gasError);
                throw new Error(`Gas estimation failed: ${gasError.message}. Make sure your contract is properly deployed and accessible.`);
            }
            console.log('Sending transaction to issue certificate...');
            const tx = await this.contract.issueCertificate(recipientAddress, title, description, issueDate);
            console.log('Transaction sent:', tx.hash);
            console.log('Waiting for transaction confirmation...');
            const receipt = await tx.wait();
            console.log('Transaction confirmed in block:', receipt.blockNumber);
            const certId = receipt.events?.[0]?.args?.certId?.toString();
            if (!certId) {
                throw new Error("Failed to retrieve certificate ID from blockchain event");
            }
            console.log('Certificate successfully issued with ID:', certId);
            return certId;
        }
        catch (error) {
            console.error('Blockchain issueCertificate error:', error);
            throw new Error(`Blockchain error: ${error.message || 'Unknown error'}`);
        }
    }
    async getCertificate(certId) {
        try {
            const cert = await this.contract.getCertificate(certId);
            if (!cert || !cert[0]) {
                throw new Error(`Certificate with ID ${certId} not found on blockchain`);
            }
            return {
                issuer: cert[0],
                recipient: cert[1],
                title: cert[2],
                description: cert[3],
                issueDate: cert[4],
                verifiedAt: new Date().toISOString(),
                recipientIsAddress: ethers_1.ethers.utils.isAddress(cert[1])
            };
        }
        catch (error) {
            console.error('Blockchain getCertificate error:', error);
            throw new Error(`Blockchain verification failed: ${error.message || 'Certificate not found'}`);
        }
    }
};
exports.CertificateOnChainService = CertificateOnChainService;
exports.CertificateOnChainService = CertificateOnChainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CertificateOnChainService);
//# sourceMappingURL=certificate.onchain.service.js.map