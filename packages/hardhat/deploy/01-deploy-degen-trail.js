const { ethers, network } = require("hardhat");
const fs = require("fs").promises;

module.exports = async ({ deployments, getNamedAccounts }) => {

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const NFT_NAME = "Settlement";
    const NFT_SYMBOL = "🏠";
    const FT_NAME = "Coins";
    const FT_SYMBOL = "💰";

    // retrieve ERC6551 contracts
    const registryContract = await deployments.get("ERC6551Registry");
    const accountContract = await deployments.get("ERC6551Account");

    // deploy BindingERC721
    const erc721 = await deploy("PermissionlessBindingERC721", {
        from: deployer,
        log: true,
        autoMine: true,
        args: [
            NFT_NAME,
            NFT_SYMBOL,
            registryContract.address, 
            accountContract.address,
            0 // decimals
        ],
    });

    log(`PermissionlessBindingERC721 (${network.name}) deployed to ${erc721.address}`);

    // Mint several tokens
    const signers = await ethers.getSigners();

    const erc721Signed = await ethers.getContractAt(
        "PermissionlessBindingERC721", 
        erc721.address, 
        signers[0]);

    // for (let i = 0; i < 3; i++) {
    //     await erc721Signed.mint(deployer);
    // }   

}