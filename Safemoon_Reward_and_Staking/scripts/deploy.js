async function main() {
    const Factory = await ethers.getContractFactory("Trade")
    console.log("Deploying Factory, ProxyAdmin, and then Proxy...")
    const proxy = await upgrades.deployProxy(Factory,["0x5e83Fa4293f3294bd400dAc8F0482bB17Fe475Ad",
    "0xCB2d2B86EE7009B0589d529989504D8f2291BeaD","0x9848266f67BfD68C1E66217Aaba8A10241286792"], { initializer: 'initialize' })
    console.log("Proxy of Factory deployed to:", proxy.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
