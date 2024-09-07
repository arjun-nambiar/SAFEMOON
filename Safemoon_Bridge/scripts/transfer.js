async function main() {
    const BoxV2 = await ethers.getContractFactory("BridgeEth")
    let box = await upgrades.upgradeProxy("0x230Be8ac77a29cDEe704f1e501802631187DaB5f", BoxV2)
    console.log("Your upgraded proxy is done!", box.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
