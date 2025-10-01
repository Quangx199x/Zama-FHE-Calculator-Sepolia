const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying FHE Calculator to Sepolia...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance < hre.ethers.parseEther("0.01")) {
    console.warn("⚠️  Warning: Low balance! Get Sepolia ETH from faucet.");
  }

  console.log("\n📝 Deploying FHECalculator contract...");
  const FHECalculator = await hre.ethers.getContractFactory("FHECalculator");
  
  const calculator = await FHECalculator.deploy();
  await calculator.waitForDeployment();
  
  const calculatorAddress = await calculator.getAddress();
  
  console.log("✅ FHECalculator deployed to:", calculatorAddress);
  console.log("🔗 View on Etherscan:", `https://sepolia.etherscan.io/address/${calculatorAddress}`);

  // Wait for a few block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await calculator.deploymentTransaction().wait(5);

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: "sepolia",
    chainId: 11155111,
    calculator: calculatorAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber()
  };

  fs.writeFileSync(
    './deployment-sepolia.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✅ Deployment completed!");
  console.log("📄 Deployment info saved to deployment-sepolia.json");
  
  // Verify contract
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n📋 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: calculatorAddress,
        constructorArguments: []
      });
      console.log("✅ Contract verified!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
      console.log("You can verify manually at:", `https://sepolia.etherscan.io/address/${calculatorAddress}#code`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });