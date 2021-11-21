// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
const NFLab = await hre.ethers.getContractFactory("NearFutureLaboratory");
const nflab = await NFLab.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3');
//await nflab.deployed();
console.log("NFLAB deployed to: ", nflab.address);

const [owner, secondAccount, thirdAccount] = await ethers.getSigners();
//console.log(owner.address);

// var b = await nflab.wtf();
// console.log(b);
//console.log(nflab);

var balance0 = await nflab.balanceOf(owner.address);
// console.log("balance of ", owner.address, "is ", balance0.toString());
// console.log("Also ", ethers.utils.formatEther(balance0));

// nflab.transfer(secondAccount.address, balance0);
// var balance2 = await nflab.balanceOf(secondAccount.address);
// console.log("And ", ethers.utils.formatEther(balance2));

// balance0 = await nflab.balanceOf(owner.address);
// console.log("Now balance of owner ", owner.address, "is as String ", balance0.toString());
// console.log("Also owner balance formatEther ", ethers.utils.formatEther(balance0));

// console.log("And recipient balance is ", ethers.utils.formatEther(balance2));
// console.log("And recipient balance as String is ", balance2.toString());


}

async function test() {

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
