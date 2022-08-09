import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "ethers"

const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher"
const SIGNING_DOMAIN_VERSION = "1"


export const voucher = async (
    contract: ethers.Contract,
    chainId: number,
    signer: ethers.providers.JsonRpcSigner,
    name: string,
    uri: string
) => {
    const voucher = { name, uri }
    const domain = {
        name: SIGNING_DOMAIN_NAME,
        version: SIGNING_DOMAIN_VERSION,
        verifyingContract: contract.address,
        chainId,
    }

    const types = {
        NFTVoucher: [
            { name: "name", type: "string" },
            { name: "uri", type: "string" },
        ]
    }
    const signature = await signer._signTypedData(domain, types, voucher)
    return {
        ...voucher,
        signature,
    }
}

