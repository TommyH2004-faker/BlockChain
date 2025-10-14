import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { CERTIFICATE_CONTRACT_ADDRESS } from './certificate.address';
import * as contractJson from '../../../artifacts/contracts/Certificate.sol/Certificate.json';

@Injectable()
export class CertificateOnChainService {
  private provider: ethers.providers.Provider;
  private contract: ethers.Contract;
  private signer: ethers.Wallet;

  constructor() {
    try {
      console.log('Initializing blockchain service with StaticJsonRpcProvider...');
      
      // Sử dụng StaticJsonRpcProvider để tránh ENS lookup
      this.provider = new ethers.providers.StaticJsonRpcProvider(
        'http://127.0.0.1:8545',
        {
          name: 'localhost',
          chainId: 31337
        }
      );

      // Hardcode contract address to ensure it's correct
      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      console.log('Using contract address:', contractAddress);

      // Khởi tạo signer với private key
      const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      this.signer = new ethers.Wallet(privateKey).connect(this.provider);
      console.log('Signer address:', this.signer.address);

      // Khởi tạo contract với signer
      this.contract = new ethers.Contract(
        contractAddress,
        contractJson.abi,
        this.signer
      );
      
      // Test contract to ensure it's working
      this.testContractConnection();
      
      console.log('Contract interface initialized successfully');
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw new Error(`Blockchain initialization failed: ${error.message}`);
    }
  }

  async testContractConnection() {
    try {
      // Kiểm tra signer
      const signerAddress = await this.signer.getAddress();
      console.log('Connected with signer:', signerAddress);
      
      // Kiểm tra contract functions
      const functions = Object.keys(this.contract.functions);
      console.log('Contract functions:', functions);
      
      // Thử gọi hàm certCount để kiểm tra kết nối
      if (functions.includes('certCount()')) {
        const count = await this.contract.certCount();
        console.log('Current certificate count:', count.toString());
      } else {
        console.warn('certCount() function not found in contract');
      }
      
    } catch (error) {
      console.error('Contract connection test failed:', error);
    }
  }

  async issueCertificate(recipient: string, title: string, description: string, issueDate: string) {
    console.log(`Issuing certificate for ${recipient}: "${title}"`);
    
    try {
      // Tạo địa chỉ từ username nếu không phải địa chỉ hợp lệ
      let recipientAddress = recipient;
      if (!ethers.utils.isAddress(recipient)) {
        const hash = ethers.utils.id(recipient);
        recipientAddress = ethers.utils.getAddress('0x' + hash.slice(2, 42));
        console.log(`Generated address from username: ${recipient} -> ${recipientAddress}`);
      }
      
      // Log all params
      console.log('Transaction params:', {
        recipient: recipientAddress,
        title,
        description,
        issueDate
      });
      
      // Kiểm tra function tồn tại
      if (!this.contract.functions['issueCertificate(address,string,string,string)']) {
        throw new Error('issueCertificate function not found in contract');
      }
      
      // Override gas limit
      const overrides = {
        gasLimit: 1000000
      };
      
      // Gửi transaction
      console.log('Sending transaction with fixed gasLimit...');
      const tx = await this.contract.issueCertificate(
        recipientAddress, 
        title, 
        description, 
        issueDate,
        overrides
      );
      console.log('Transaction sent:', tx.hash);
      
      // Đợi receipt
      const receipt = await tx.wait();
      console.log('Transaction confirmed in block:', receipt.blockNumber);
      console.log('Transaction receipt:', JSON.stringify(receipt, null, 2));
      
      // Nếu không có events, tạo một ID giả
      if (!receipt.events || receipt.events.length === 0) {
        console.warn('No events found in transaction receipt, using transaction hash as certificate ID');
        // Use transaction hash as certificate ID if no events
        return receipt.transactionHash;
      }
      
      // Tìm event có tên CertificateIssued
      let certId;
      for (const event of receipt.events) {
        console.log('Event:', event.event, event.args);
        if (event.event === 'CertificateIssued' && event.args && event.args.certId) {
          certId = event.args.certId.toString();
          break;
        }
      }
      
      // Nếu không tìm thấy event cụ thể, dùng hash transaction
      if (!certId) {
        console.warn('Certificate ID not found in events, using transaction hash');
        certId = receipt.transactionHash;
      }
      
      console.log('Certificate successfully issued with ID:', certId);
      return certId;
    } catch (error) {
      console.error('Blockchain issueCertificate error:', error);
      
      // Cung cấp thông tin lỗi chi tiết hơn
      let errorMessage = `Blockchain error: ${error.message}`;
      
      if (error.code === 'UNSUPPORTED_OPERATION' && error.operation === 'estimateGas') {
        errorMessage = 'Cannot estimate gas. The contract may not be deployed correctly.';
      } else if (error.code === 'CALL_EXCEPTION') {
        errorMessage = 'Smart contract rejected the transaction. Check that your contract is correctly deployed.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Make sure Hardhat node is running at http://127.0.0.1:8545';
      }
      
      throw new Error(errorMessage);
    }
    
  }

  async getCertificate(certId: string) {
  try {
    // Nếu certId là số, chuyển sang chuỗi
    const isNumeric = /^\d+$/.test(certId);
    
    // Nếu là transaction hash
    if (certId.startsWith('0x') && certId.length === 66) {
      console.log('Using transaction hash as certificate ID');
      const receipt = await this.provider.getTransactionReceipt(certId);
      if (!receipt) {
        throw new Error('Transaction not found');
      }
      
      const tx = await this.provider.getTransaction(certId);
      
      return {
        issuer: tx.from,
        recipient: tx.to,
        title: 'Certificate',
        description: 'Certificate validated on blockchain',
        issueDate: new Date().toISOString().split('T')[0],
        transactionHash: certId,
        blockNumber: receipt.blockNumber,
        verifiedAt: new Date().toISOString()
      };
    } 
    // Nếu là số hoặc chuỗi số
    else if (isNumeric) {
      console.log('Using numeric ID to look up certificate');
      try {
        const cert = await this.contract.getCertificate(certId);
        return {
          issuer: cert[0],
          recipient: cert[1],
          title: cert[2],
          description: cert[3],
          issueDate: cert[4],
          verifiedAt: new Date().toISOString()
        };
      } catch (err) {
        console.error('Error looking up certificate by ID:', err);
        throw err;
      }
    }
    // Không phải dạng hợp lệ
    else {
      throw new Error(`Invalid certificate ID format: ${certId}`);
    }
  } catch (error) {
    console.error('Blockchain getCertificate error:', error);
    throw new Error(`Blockchain verification failed: ${error.message}`);
  }
}
}