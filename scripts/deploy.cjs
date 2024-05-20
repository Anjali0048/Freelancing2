const { ethers, run, network } = require('hardhat');

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether');
}

async function main () {

    // setup accounts
    const [client, freelancer, arbiter] = await ethers.getSigners();

    const FreelanceToken = await ethers.getContractFactory("FreelanceToken");
    console.log('Deploying FreelanceToken contract...')
    const freelanceToken = await FreelanceToken.deploy();
    const freelanceTokenAddress = await freelanceToken.getAddress();
    console.log('FreelanceToken Deployed to : ', freelanceTokenAddress);
            
    await freelanceToken.mint(client.address, tokens(1000));

    const Escrow = await ethers.getContractFactory("Escrow");
    console.log('Deploying Escrow contract...')
    const escrow = await Escrow.deploy(client.address, freelancer.address, arbiter.address, freelanceTokenAddress, 100);
    console.log('Escrow Deployed to : ', await escrow.getAddress());

    console.log("-------------------------------------------------------------------");
       
}

// async function verify(contractAddress, args) {
//     console.log("verifying contract")
//     try {
//         await run("verify:verify", {
//             address: contractAddress,
//             constructorArguments: args,
//         })
//     } catch (error) {
//         if(error.message.toLowerCase().includes("already verified")){
//             console.log("Already Verified")
//         }
//         else{
//             console.log(error)
//         }
//     }
// }

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });