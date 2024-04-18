const { ethers, network } = require("hardhat");
const fs = require("fs").promises;

module.exports = async ({ deployments, getNamedAccounts }) => {
    const existingConfig = JSON.parse(await fs.readFile("config/deployment-config.json", "utf8"));

    const { name, symbol, owner, initialSupply } = existingConfig[network.name].TestToken;

    const { deploy, log } = deployments;

    const { deployer } = await getNamedAccounts();

    const args = [name, symbol, initialSupply, owner];

    const waitConfirmation = network.config.chainId === 31337 ? 0 : 6;

    const TestToken = await deploy("TestToken", {
        from: deployer,
        args,
        automine: true,
        log: true,
        waitConfirmations: network.config.chainId === 31337 ? 0 : 6,
    });

    log(`TestToken Token (${network.name}) deployed to ${TestToken.address}`);

    const { blocksToAct, rollFee, rerollFee } = existingConfig[network.name].Bandit;
    const TestTokenAddress = TestToken.address;

    const Bandit = await deploy("Bandit", {
        from: deployer,
        args: [blocksToAct, TestTokenAddress, rollFee, rerollFee],
        automine: true,
        log: true,
        waitConfirmations: network.config.chainId === 31337 ? 0 : 6
    });

    log(`Bandit (${network.name}) deployed to ${Bandit.address}`);
}

module.exports.tags = ["NFT", "all", "hardhat", "mumbai", "sepolia", "goerli", "fuji", "polygon", "ethereum", "avalanche", "opSepolia"];
