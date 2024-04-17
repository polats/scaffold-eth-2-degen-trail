const { ethers, network } = require("hardhat");
const fs = require("fs").promises;

module.exports = async ({ deployments, getNamedAccounts }) => {

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const args = [];

    // deploy registry
    const registryContract = await deploy("ERC6551Registry", {
        from: deployer,
        log: true,
        autoMine: true,
    });

    log(`ERC6551Registry (${network.name}) deployed to ${registryContract.address}`);

    // deploy account implementation
    const accountContract = await deploy("ERC6551Account", {
        from: deployer,
        log: true,
        autoMine: true,
    });

    log(`ERC6551Account (${network.name}) deployed to ${accountContract.address}`);
}