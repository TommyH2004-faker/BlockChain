const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.log('Deploying Certificate contract...');
    
    // Get the contract factory
    const Certificate = await ethers.getContractFactory("Certificate");
    
    // Deploy the contract
    const certificate = await Certificate.deploy();
    
    // Wait for deployment to complete
    await certificate.deployed();
    
    // Log the deployment address
    console.log("Certificate contract deployed to:", certificate.address);
    
    // Path to the address file
    const addressFilePath = path.join(__dirname, '../src/certificate.address.ts');
    
    // Create the content of the address file
    const addressFileContent = `export const CERTIFICATE_CONTRACT_ADDRESS = "${certificate.address}";\n`;
    
    // Write the address to the file
    fs.writeFileSync(addressFilePath, addressFileContent);
    console.log(`Updated contract address in ${addressFilePath}`);
    
    // Return the deployed address
    return certificate.address;
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  }
}

// Run the deployment
main()
  .then(address => {
    console.log("Deployment completed successfully with address:", address);
  })
  .catch(error => {
    console.error("Deployment script failed:", error);
    process.exitCode = 1;
  });