const { getNamedAccounts, deployments, network, ethers } = require("hardhat");

const FUND_AMOUNT = "1000000000000000000000";

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...");
        const LinkToken = await deploy("LinkToken", {
            from: deployer,
            log: true,
        });
        const link = LinkToken.address;
        const VRFCoordinatorMock = await deploy("VRFCoordinatorMock", {
            from: deployer,
            log: true,
            args: [link],
        });

        // let provider = ethers.getDefaultProvider(network);

        //Funding vrfCoordinator with required Fee
        // let tx = {
        //     to: VRFCoordinatorMock.address,
        //     value: ethers.utils.parseUnits('30', 16)
        // };

        // deployer.sendTransaction(tx).then((transaction) => {
        //     console.log(transaction);
        //     alert("Send finished!");
        // });

        // console.log(VRFCoordinatorMock.address);

        log("Mocks Deployed!");
        log("----------------------------------------------------------");
        log("You are deploying to a local network, you'll need a local network running to interact");
        log("----------------------------------------------------------");
    }
};
module.exports.tags = ["all", "mocks"];
