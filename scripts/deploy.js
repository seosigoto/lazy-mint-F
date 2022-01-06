async function main() {

    if (network.name === "hardhat") {
      console.warn(
        "You are trying to deploy a contract to the Hardhat Network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const C = await ethers.getContractFactory("Lazy");
    const c = await C.deploy();
    await c.deployed();

    console.log("Token address:", c.address);

    saveFrontendFiles(c);
  }

  function saveFrontendFiles(c) {
    const fs = require("fs");
    const contractsDir = __dirname + "/compiled";

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
      contractsDir + "/contract-address.json",
      JSON.stringify({ Lazy: c.address }, undefined, 2)
    );

    const LazyArtifact = artifacts.readArtifactSync("Lazy");

    fs.writeFileSync(
      contractsDir + "/Lazy.json",
      JSON.stringify(LazyArtifact, null, 2)
    );
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
