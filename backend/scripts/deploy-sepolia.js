const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying Certificate contract to Sepolia...");
  
  // Deploy contract
  const Certificate = await hre.ethers.getContractFactory("Certificate");
  const certificate = await Certificate.deploy();
  
  console.log("Waiting for deployment...");
  await certificate.deployed();
  
  console.log("Certificate contract deployed to:", certificate.address);
  console.log("Transaction hash:", certificate.deployTransaction.hash);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId);

  // Update certificate address file
  const addressPath = path.join(__dirname, '../src/certificate.address.ts');
  const addressContent = `// Certificate contract address for ${hre.network.name}
export const CERTIFICATE_CONTRACT_ADDRESS = "${certificate.address}";
export const NETWORK_NAME = "${hre.network.name}";
export const CHAIN_ID = ${hre.network.config.chainId};
`;

  fs.writeFileSync(addressPath, addressContent);
  console.log(`Updated certificate address in: ${addressPath}`);

  // Update blockchain module address file  
  const blockchainAddressPath = path.join(__dirname, '../src/modules/blockchain/certificate.address.ts');
  fs.writeFileSync(blockchainAddressPath, addressContent);
  console.log(`Updated blockchain module address in: ${blockchainAddressPath}`);

  // Wait a bit before verification
  console.log("Waiting 30 seconds before verification...");
  await new Promise(resolve => setTimeout(resolve, 30000));

  // Verify contract on Etherscan
  if (hre.network.name !== "hardhat" && process.env.ETHERSCAN_API_KEY) {
    try {
      console.log("Verifying contract on Etherscan...");
      await hre.run("verify:verify", {
        address: certificate.address,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  console.log("\n=== Deployment Summary ===");
  console.log(`Contract Address: ${certificate.address}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Chain ID: ${hre.network.config.chainId}`);
  console.log(`Transaction Hash: ${certificate.deployTransaction.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });