const { ethers } = require('ethers');
require('dotenv').config();

async function checkBalance() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    
    // Check target address
    const targetAddress = '0xb83b1af256f277a697504427c9cb9191b0ec8f71';
    const balance = await provider.getBalance(targetAddress);
    const balanceInEth = ethers.utils.formatEther(balance);
    
    console.log('\n=== SEPOLIA ADDRESS INFO ===');
    console.log('Address:', targetAddress);
    console.log('Balance:', balanceInEth, 'ETH');
    console.log('Balance in Wei:', balance.toString());
    
    // Check if enough for deploy
    const minRequired = ethers.utils.parseEther('0.01');
    if (balance.gte(minRequired)) {
      console.log('✅ Sufficient balance for deployment!');
    } else {
      console.log('❌ Insufficient balance. Need at least 0.01 ETH');
    }
    
    // Check current private key address
    if (process.env.SEPOLIA_PRIVATE_KEY) {
      const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY);
      console.log('\n=== CURRENT PRIVATE KEY INFO ===');
      console.log('Private key corresponds to address:', wallet.address);
      
      if (wallet.address.toLowerCase() === targetAddress.toLowerCase()) {
        console.log('✅ Private key matches target address!');
      } else {
        console.log('❌ WARNING: Private key does NOT match target address!');
        console.log('You need to update SEPOLIA_PRIVATE_KEY in .env file');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkBalance();