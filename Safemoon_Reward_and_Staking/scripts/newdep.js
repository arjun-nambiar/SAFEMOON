async function main() {
    const Router = await ethers.getContractFactory("Useless")
    console.log("Deploying Contract....")
    const router = await Router.deploy()
    console.log("Deployed to:", router.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
