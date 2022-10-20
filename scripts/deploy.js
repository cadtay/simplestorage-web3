// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const simpleStorageFactory = await hre.ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contarct");

  const simpleStorage = await simpleStorageFactory.deploy();
  await simpleStorage.deployed();

  console.log(`Deployed contract to ${simpleStorage.address}`);

  if (hre.network.config.chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value is: ${currentValue.toString()}`);

  const transactionResponse = await simpleStorage.store(99);
  await transactionResponse.wait(1);

  const newValue = await simpleStorage.retrieve();
  console.log(`New value is: ${newValue.toString()}`);
}

async function verify(contractAddress, args) {
  console.log("Verifying contract..");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("already verified");
    } else {
      console.log(e);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
