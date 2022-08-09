import { ethers } from "hardhat";
import { LazyNFT, LazyNFT__factory } from "../typechain-types";
import hre from 'hardhat';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// @ts-ignore
import { LazyMinter } from "../utils";
import { createVoucher } from "./utils";
import { expect } from "chai";

const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher"
const SIGNING_DOMAIN_VERSION = "1"

const chainId = hre.network.config.chainId!
const uri = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";

describe("LazyNFT", function () {
  it("Should deploy", async function () {
    const signers = await ethers.getSigners();
    const minter = signers[0].address;

    const LazyNFT: LazyNFT__factory = await ethers.getContractFactory("LazyNFT");
    const lazynft: LazyNFT = await LazyNFT.deploy(minter);
    await lazynft.deployed();
  });

  it("Should be able to mint token with signer's voucher", async function () {
    const [minter, signer1, signer2, signer3, _] = await ethers.getSigners();
    const LazyNFT: LazyNFT__factory = await ethers.getContractFactory("LazyNFT");
    const lazynft: LazyNFT = await LazyNFT.deploy(minter.address);

    console.log("minter.address: ", minter.address)
    console.log("signer1.address: ", signer1.address)

    const _voucher1 = await createVoucher(lazynft, chainId, signer1, "Ali", uri);
    const _voucher2 = await createVoucher(lazynft, chainId, signer2, "Alina", uri);
    const _voucher3 = await createVoucher(lazynft, chainId, signer3, "Ismail", uri);


    await lazynft.connect(minter).mint(_voucher1);
    await lazynft.connect(minter).mint(_voucher2);
    await lazynft.connect(minter).mint(_voucher3);

    expect(await lazynft.balanceOf(signer1.address)).to.be.equal(1)
    expect(await lazynft.balanceOf(signer2.address)).to.be.equal(1)
    expect(await lazynft.balanceOf(signer3.address)).to.be.equal(1)


    await expect(lazynft.connect(signer1).mint(_voucher1)).to.be.reverted;
    await expect(lazynft.connect(signer2).mint(_voucher2)).to.be.reverted;
    await expect(lazynft.connect(signer3).mint(_voucher3)).to.be.reverted;


  });

});


