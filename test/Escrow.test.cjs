const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

describe("Escrow", function () {
    let freelanceToken, Escrow, escrow, client, freelancer, arbiter, freelanceTokenAddress;

    beforeEach(async function () {
        [client, freelancer, arbiter] = await ethers.getSigners();

        const FreelanceToken = await ethers.getContractFactory("FreelanceToken");
        freelanceToken = await FreelanceToken.deploy();
        freelanceTokenAddress = await freelanceToken.getAddress();
                
        await freelanceToken.mint(client.address, tokens(1000));

        Escrow = await ethers.getContractFactory("Escrow");
        escrow = await Escrow.deploy(client.address, freelancer.address, arbiter.address, freelanceTokenAddress, 10);
        
    });

    describe("Token and Escrow deployment", function () {
        it("Should deploy FreelanceToken with initial supply to the owner", async function () {
            const clientBalance = await freelanceToken.balanceOf(client.address);
            expect(clientBalance).to.equal(tokens(1000));
        });

        it("Should deploy Escrow contract", async function () {
            expect(await escrow.getAddress()).to.not.be.undefined;
        });

        it("Should assign correct addresses in Escrow contract", async function () {
            expect(await escrow.client()).to.equal(client.address);
            expect(await escrow.freelancer()).to.equal(freelancer.address);
            expect(await escrow.arbiter()).to.equal(arbiter.address);
            expect(await escrow.token()).to.equal(freelanceTokenAddress);
        });
    });

    describe("Escrow functionality", function () {
        beforeEach(async function () {
            await freelanceToken.transfer(client.address, tokens(100));
            await freelanceToken.connect(client).approve(await escrow.getAddress(), tokens(100));
            await escrow.connect(client).deposit(tokens(100));
        });

        it("Should allow client to deposit funds", async function () {
            const escrowBalance = await freelanceToken.balanceOf(await escrow.getAddress());
            expect(escrowBalance).to.equal(tokens(100));
        });

        it("Should allow freelancer to submit work", async function () {
            await escrow.connect(freelancer).submitWork("http://example.com/file");
            const fileDetails = await escrow.getFileDetails();
            expect(fileDetails[0]).to.equal("http://example.com/file");
        });

        it("Should allow client to confirm delivery", async function () {
            await escrow.connect(freelancer).submitWork("http://example.com/file");
            await escrow.connect(client).confirmDelivery();
            const escrowBalance = await freelanceToken.balanceOf(await escrow.getAddress());
            const freelancerBalance = await freelanceToken.balanceOf(freelancer.address);
            expect(escrowBalance).to.equal(0);
            expect(freelancerBalance).to.equal(tokens(100));
        });

        it("Should handle rating and reviews", async function () {
            await escrow.connect(freelancer).submitWork("http://example.com/file");
            await escrow.connect(client).confirmDelivery();
            await escrow.connect(client).rateFreelancer(5, "Great work!");
            await escrow.connect(freelancer).rateClient(4, "Good client");
    
            const [freelancerRating, freelancerReview] = await escrow.getFreelancerRating();
            const [clientRating, clientReview] = await escrow.getClientRating();
    
            expect(freelancerRating).to.equal(5);
            expect(freelancerReview).to.equal("Great work!");
            expect(clientRating).to.equal(4);
            expect(clientReview).to.equal("Good client");
        });

        
        // it("Should allow arbiter to refund client", async function () {
        //     await escrow.connect(freelancer).submitWork("http://example.com/file");
        //     await escrow.connect(arbiter).refundClient();
        //     const escrowBalance = await freelanceToken.balanceOf(await escrow.getAddress());
        //     const clientBalance = await freelanceToken.balanceOf(client.address);
        //     expect(escrowBalance).to.equal(0);
        //     expect(clientBalance).to.equal(tokens(100));
        // });
    
    
        // it("Should handle disputes", async function () {
        //     await escrow.connect(freelancer).submitWork("http://example.com/file");
        //     await escrow.connect(client).raiseDispute("Incorrect work", "Evidence URL");
        //     const disputeDetails = await escrow.getDisputeDetails();
        //     expect(disputeDetails.raised).to.equal(true);
        //     expect(disputeDetails.reason).to.equal("Incorrect work");
        //     expect(disputeDetails.evidence).to.equal("Evidence URL");
        // });
    
        // it("Should resolve disputes", async function () {
        //     await escrow.connect(freelancer).submitWork("http://example.com/file");
        //     await escrow.connect(client).raiseDispute("Incorrect work", "Evidence URL");
        //     await escrow.connect(arbiter).resolveDispute(true); // Client is correct
    
        //     const escrowBalance = await freelanceToken.balanceOf(await escrow.getAddress());
        //     const clientBalance = await freelanceToken.balanceOf(client.address);
        //     const disputeDetails = await escrow.getDisputeDetails();
        //     expect(escrowBalance).to.equal(0);
        //     expect(clientBalance).to.equal(tokens(100));
        //     expect(disputeDetails.resolver).to.equal(arbiter.address);
        // });

    });

    
});
