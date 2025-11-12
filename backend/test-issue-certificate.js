const axios = require('axios');

async function testIssueCertificate() {
  try {
    console.log('Testing issue certificate to Sepolia blockchain...\n');

    // Thông tin certificate
    const certificateData = {
      recipient: '0xb83b1af256f277a697504427c9cb9191b0ec8f71',
      title: 'Test Certificate on Sepolia',
      description: 'This is a real blockchain certificate on Sepolia testnet',
      issueDate: new Date().toISOString().split('T')[0]
    };

    console.log('Certificate data:');
    console.log(JSON.stringify(certificateData, null, 2));
    console.log('\nSending request to backend...');

    // Gọi API (cần có JWT token thật từ login)
    // Đây là test script, bạn cần replace YOUR_JWT_TOKEN
    const response = await axios.post(
      'http://localhost:8080/certificates',
      certificateData,
      {
        headers: {
          'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ SUCCESS!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.blockchainTxId) {
      console.log('\n🔗 Transaction Hash:', response.data.blockchainTxId);
      console.log('📊 View on Etherscan:', `https://sepolia.etherscan.io/tx/${response.data.blockchainTxId}`);
    }

  } catch (error) {
    console.error('\n❌ ERROR:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Test function to check if backend is running
async function checkBackend() {
  try {
    const response = await axios.get('http://localhost:8080');
    console.log('✅ Backend is running');
    return true;
  } catch (error) {
    console.log('❌ Backend is not running. Please start with: npm run start:dev');
    return false;
  }
}

async function main() {
  console.log('=== SEPOLIA BLOCKCHAIN CERTIFICATE TEST ===\n');
  
  const backendRunning = await checkBackend();
  if (!backendRunning) {
    process.exit(1);
  }

  console.log('\nℹ️  NOTE: You need a valid JWT token from login.');
  console.log('ℹ️  Steps:');
  console.log('   1. Login via frontend: http://localhost:3000/login');
  console.log('   2. Open DevTools → Console → localStorage.getItem("token")');
  console.log('   3. Copy token and replace YOUR_JWT_TOKEN_HERE in this script');
  console.log('   4. Run: node test-issue-certificate.js\n');

  // Uncomment below to test (after adding token)
  // await testIssueCertificate();
}

main();