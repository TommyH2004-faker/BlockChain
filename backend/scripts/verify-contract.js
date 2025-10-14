// Script to verify contract deployment
const { ethers } = require('hardhat');
const { CERTIFICATE_CONTRACT_ADDRESS } = require('../src/certificate.address');

async function main() {
  try {
    console.log('Verifying contract deployment at address:', CERTIFICATE_CONTRACT_ADDRESS);
    
    // Set up provider
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    
    // Check if address is valid
    if (!ethers.utils.isAddress(CERTIFICATE_CONTRACT_ADDRESS)) {
      console.error('ERROR: Invalid contract address format');
      process.exit(1);
    }
    
    // Check if contract exists at the address
    const code = await provider.getCode(CERTIFICATE_CONTRACT_ADDRESS);
    
    if (code === '0x') {
      console.error('ERROR: No contract found at the specified address');
      console.error('This means the contract is not deployed or the address is incorrect');
      process.exit(1);
    }
    
    // Try to connect to the contract
    const Certificate = await ethers.getContractFactory('Certificate');
    const contract = Certificate.attach(CERTIFICATE_CONTRACT_ADDRESS);
    
    // Call a view function to test connection
    const certCount = await contract.certCount();
    
    console.log('Contract verification successful!');
    console.log('Current certificate count:', certCount.toString());
    
    // Check network status
    const network = await provider.getNetwork();
    console.log('Connected to network:', {
      name: network.name,
      chainId: network.chainId
    });
    
    console.log('\nTEST SUCCESSFUL: Contract is correctly deployed and accessible');
  } catch (error) {
    console.error('ERROR during contract verification:', error.message);
    console.error('\nPlease follow these steps to fix:');
    console.error('1. Make sure hardhat node is running');
    console.error('2. Deploy the contract again with: npx hardhat run scripts/deploy-and-update.js --network localhost');
    console.error('3. Restart your backend');
    process.exit(1);
  }
}

main();