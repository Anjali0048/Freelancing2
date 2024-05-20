const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

describe("FreelanceToken", function () {
    let FreelanceToken, freelanceToken, owner, addr1;

    beforeEach(async function () {
        FreelanceToken = await ethers.getContractFactory("FreelanceToken");
        [owner, addr1] = await ethers.getSigners();
        freelanceToken = await FreelanceToken.deploy(tokens(1000));
        await freelanceToken.deployed();
    });

    it("Should deploy and assign initial supply to the owner", async function () {
        const ownerBalance = await freelanceToken.balanceOf(owner.address);
        expect(ownerBalance).to.equal(tokens(1000));
    });

    it("Should transfer tokens between accounts", async function () {
        await freelanceToken.transfer(addr1.address, tokens(50));
        const addr1Balance = await freelanceToken.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(tokens(50));
    });
});
