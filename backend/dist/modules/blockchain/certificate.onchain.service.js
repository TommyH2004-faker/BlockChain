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
const contractJson = __importStar(require("../../../artifacts/contracts/Certificate.sol/Certificate.json"));
let CertificateOnChainService = class CertificateOnChainService {
    constructor() {
        try {
            console.log('Initializing blockchain service with StaticJsonRpcProvider...');
            this.provider = new ethers_1.ethers.providers.StaticJsonRpcProvider('http://127.0.0.1:8545', {
                name: 'localhost',
                chainId: 31337
            });
            const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
            console.log('Using contract address:', contractAddress);
            const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
            this.signer = new ethers_1.ethers.Wallet(privateKey).connect(this.provider);
            console.log('Signer address:', this.signer.address);
            this.contract = new ethers_1.ethers.Contract(contractAddress, contractJson.abi, this.signer);
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
            const signerAddress = await this.signer.getAddress();
            console.log('Connected with signer:', signerAddress);
            const functions = Object.keys(this.contract.functions);
            console.log('Contract functions:', functions);
            if (functions.includes('certCount()')) {
                const count = await this.contract.certCount();
                console.log('Current certificate count:', count.toString());
            }
            else {
                console.warn('certCount() function not found in contract');
            }
        }
        catch (error) {
            console.error('Contract connection test failed:', error);
        }
    }
    async issueCertificate(recipient, title, description, issueDate) {
        console.log(`Issuing certificate for ${recipient}: "${title}"`);
        try {
            let recipientAddress = recipient;
            if (!ethers_1.ethers.utils.isAddress(recipient)) {
                const hash = ethers_1.ethers.utils.id(recipient);
                recipientAddress = ethers_1.ethers.utils.getAddress('0x' + hash.slice(2, 42));
                console.log(`Generated address from username: ${recipient} -> ${recipientAddress}`);
            }
            console.log('Transaction params:', {
                recipient: recipientAddress,
                title,
                description,
                issueDate
            });
            if (!this.contract.functions['issueCertificate(address,string,string,string)']) {
                throw new Error('issueCertificate function not found in contract');
            }
            const overrides = {
                gasLimit: 1000000
            };
            console.log('Sending transaction with fixed gasLimit...');
            const tx = await this.contract.issueCertificate(recipientAddress, title, description, issueDate, overrides);
            console.log('Transaction sent:', tx.hash);
            const receipt = await tx.wait();
            console.log('Transaction confirmed in block:', receipt.blockNumber);
            console.log('Transaction receipt:', JSON.stringify(receipt, null, 2));
            if (!receipt.events || receipt.events.length === 0) {
                console.warn('No events found in transaction receipt, using transaction hash as certificate ID');
                return receipt.transactionHash;
            }
            let certId;
            for (const event of receipt.events) {
                console.log('Event:', event.event, event.args);
                if (event.event === 'CertificateIssued' && event.args && event.args.certId) {
                    certId = event.args.certId.toString();
                    break;
                }
            }
            if (!certId) {
                console.warn('Certificate ID not found in events, using transaction hash');
                certId = receipt.transactionHash;
            }
            console.log('Certificate successfully issued with ID:', certId);
            return certId;
        }
        catch (error) {
            console.error('Blockchain issueCertificate error:', error);
            let errorMessage = `Blockchain error: ${error.message}`;
            if (error.code === 'UNSUPPORTED_OPERATION' && error.operation === 'estimateGas') {
                errorMessage = 'Cannot estimate gas. The contract may not be deployed correctly.';
            }
            else if (error.code === 'CALL_EXCEPTION') {
                errorMessage = 'Smart contract rejected the transaction. Check that your contract is correctly deployed.';
            }
            else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Network error. Make sure Hardhat node is running at http://127.0.0.1:8545';
            }
            throw new Error(errorMessage);
        }
    }
    async getCertificate(certId) {
        try {
            if (certId.startsWith('0x') && certId.length === 66) {
                console.log('Certificate ID appears to be a transaction hash');
                const receipt = await this.provider.getTransactionReceipt(certId);
                if (!receipt) {
                    throw new Error('Transaction not found');
                }
                const tx = await this.provider.getTransaction(certId);
                if (!tx || !tx.from || !tx.to) {
                    throw new Error('Transaction details incomplete');
                }
                return {
                    issuer: tx.from,
                    recipient: tx.to,
                    title: 'Certificate',
                    description: 'Blockchain verified certificate',
                    issueDate: new Date().toISOString().split('T')[0],
                    verifiedAt: new Date().toISOString(),
                    blockNumber: receipt.blockNumber,
                    transactionHash: certId
                };
            }
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
                verifiedAt: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('Blockchain getCertificate error:', error);
            throw new Error(`Blockchain verification failed: ${error.message}`);
        }
    }
};
exports.CertificateOnChainService = CertificateOnChainService;
exports.CertificateOnChainService = CertificateOnChainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CertificateOnChainService);
//# sourceMappingURL=certificate.onchain.service.js.map