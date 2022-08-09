import { deployments, ethers } from "hardhat"

// const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")

const frontEndContractsFile = "../frontend/utils/contractAddresses.json"
const frontEndAbiFile = "../frontend/utils/abis.json"

module.exports = async () => {
        console.log("")
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
}

async function updateAbi() {
    const LazyNFTContract = await deployments.get("LazyNFT");
    fs.writeFileSync(frontEndAbiFile, JSON.stringify(LazyNFTContract.abi))
}

async function updateContractAddresses() {
    const LazyNFTContract = await deployments.get("LazyNFT");    
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    contractAddresses["lazyNFT"] = LazyNFTContract.address
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

const vote = async () => {
    
}


module.exports.tags = ["all", "frontend"]
