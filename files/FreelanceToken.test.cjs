const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FreelanceToken", function () {
    let owner, recipient;
    let FreelanceToken, freelanceToken;

    beforeEach(async function () {
        [owner, recipient] = await ethers.getSigners();

        // Deploy FreelanceToken contract
        FreelanceToken = await ethers.getContractFactory("FreelanceToken");
        freelanceToken = await FreelanceToken.deploy();

        let freelanceAddress = await freelanceToken.getAddress()

        console.log("freelanceToken contract addredss : ",freelanceAddress);
    });

    it("Should deploy with the correct name and symbol", async function () {
        expect(await freelanceToken.name()).to.equal("FreelanceToken");
        expect(await freelanceToken.symbol()).to.equal("FLT");
    });

    it("Should mint tokens to the recipient when called by the owner", async function () {
        // Mint tokens to the recipient
        await freelanceToken.connect(owner).mint(recipient.address, 1000);

        // Check recipient's balance
        const recipientBalance = await freelanceToken.balanceOf(recipient.address);
        expect(recipientBalance).to.equal(1000);
    });

    it("Should revert when minting tokens by non-owner", async function () {
        // Attempt to mint tokens by the recipient
        await expect(freelanceToken.connect(recipient).mint(recipient.address, 1000)).to.be.revertedWith("Ownable: caller is not the owner");
    });
});
