async function main() {
    const BoxV2 = await ethers.getContractFactory("Trade")
    let box = await upgrades.upgradeProxy("0x72CcFD72902A60f141930a11e4E2E17DF8d0D771", BoxV2)
    console.log("Your upgraded proxy is done!", box.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
