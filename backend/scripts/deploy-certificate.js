const { ethers } = require("hardhat");

async function main() {
  const Certificate = await ethers.getContractFactory("Certificate");
  const certificate = await Certificate.deploy();
  await certificate.deployed();
  console.log("Certificate deployed to:", certificate.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
