const hre = require("hardhat");

async function main() {
  // Get the Contract factory
  const Certificate = await hre.ethers.getContractFactory("Certificate");
  
  // Deploy the contract
  const certificate = await Certificate.deploy();
  await certificate.deployed();

  console.log("Certificate contract deployed to:", certificate.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });