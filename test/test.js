const { expect } = require("chai");
const { ethers } = require("hardhat");

// const NFLab = await ethers.getContractFactory("NearFutureLaboratory");
// const nflab = await NFLab.deploy();
// await nflab.deployed();

// const [owner, secondAccount, thirdAccount] = await ethers.getSigners();
// console.log(owner.address);

// var b = await nflab.wtf();
// console.log(b);

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

describe("NFLab ERC20", function() {

    let NFLab;
    let nflab;
    let owner;
    let addr1;
    let addr2;
    let addrs;

beforeEach(async function() {
    NFLab = await ethers.getContractFactory("NearFutureLaboratory");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    nflab = await NFLab.deploy();
});

describe("Deployment", function() {
// `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
        // Expect receives a value, and wraps it in an Assertion object. These
        // objects have a lot of utility methods to assert values.
  
        // This test expects the owner variable stored in the contract to be equal
        // to our Signer's owner.
        expect(await nflab.owner()).to.equal(owner.address);
      });
  
      it("Should assign the total supply of tokens to the owner", async function () {
        const ownerBalance = await nflab.balanceOf(owner.address);
        const cap = await nflab.cap();

        expect(await nflab.totalSupply()).to.equal(ownerBalance);
        //console.log("-> ", f.toString());
      });

      it("Cap should be the same as tokens owned by owner", async function() {
        const ownerBalance = await nflab.balanceOf(owner.address);
        const cap = await nflab.cap();
        expect(ownerBalance == cap);
      });

      it("Cap should be 500,000", async function() {
        const cap = await nflab.cap();
        expect(cap == BigInt(500000 * 10**18));
      });
});

describe("Transactions", function () {
    it("Should transfer tokens between owner and addr1", async function () {
      // Transfer 50 tokens from owner to addr1
      await nflab.transfer(addr1.address, BigInt(30 * 10**18))

      const addr1Balance = await nflab.balanceOf(addr1.address);
      var f = await nflab.balanceOf(addr1.address);
      //console.log("->> ", f);
      //console.log("->> ", ethers.utils.formatEther(f));

      expect(addr1Balance).to.equal(BigInt(30 * 10**18) );

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
    //   await nflab.connect(addr1).transfer(addr2.address, 50);
    //   const addr2Balance = await nflab.balanceOf(addr2.address);
    //   expect(addr2Balance).to.equal(50);
    });

    it("Should transfer tokens between addr1 and addr2", async function () {
      // Transfer 50 tokens from owner to addr1
      await nflab.transfer(addr1.address, BigInt(30 * 10**18))

      const addr1Balance = await nflab.balanceOf(addr1.address);
      var f = await nflab.balanceOf(addr1.address);

      expect(addr1Balance).to.equal(BigInt(30 * 10**18) );

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await nflab.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await nflab.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should emit Rescind event", async function() {
      await nflab.transfer(addr1.address, BigInt(500 * 10**18)  );
      await expect(
        nflab.rescindTokens(addr1.address, BigInt(250 * 10**18) )
      ).to.emit(nflab, "Rescind").withArgs(addr1.address, BigInt(250 * 10**18) )
    })

    it("Should rescind tokens from an account that arrive in owner", async function () {

      await nflab.transfer(addr1.address, BigInt(500 * 10**18)  );

      var ownerBalance = await nflab.balanceOf(owner.address);
      expect(ownerBalance).to.equal(BigInt(await nflab.cap()) - BigInt(500 * 10**18))
      //var ownerBalance = await nflab.balanceOf(owner.address);
      //console.log("ownerBalanceBefore ->>", ethers.utils.formatEther(ownerBalance))
      await nflab.rescindTokens(addr1.address, BigInt(250 * 10**18) );

      const addr1Balance = await nflab.balanceOf(addr1.address);
 
      //console.log("->> ", ethers.utils.formatEther(addr1Balance));
      //console.log("ownerBalanceAfter ->>", ethers.utils.formatEther(ownerBalance));
      ownerBalance = await nflab.balanceOf(owner.address);

      expect(addr1Balance).to.equal(BigInt(250 * 10**18) );
      expect(ownerBalance).to.equal(BigInt(BigInt(await nflab.cap()) - BigInt(250*10**18)));
    });

    it("Should fail to mint more tokens than the cap", async function() {
      await expect (
        nflab.mint(addr1.address, BigInt(1 * 10**18))
      ).to.be.revertedWith("Mint would exceed total cap");
    });

    it("Should burn 1000 tokens", async function() {
      var totalSupply = await nflab.totalSupply();
      var burnAmount = 1000 * 10**18;
      await expect(nflab.burn(BigInt(burnAmount))

      ).to.emit(nflab, "Burn").withArgs(nflab.owner, BigInt(burnAmount));

      var ownerBalance = await nflab.balanceOf(owner.address);
      expect(ownerBalance).to.equal(BigInt(totalSupply) - BigInt(burnAmount)); 
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await nflab.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        nflab.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await nflab.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should emit Transfer event", async function() {
      await expect( 
        nflab.transfer(addr1.address, BigInt(30 * 10**18))
      ).to.emit(nflab, "Transfer").withArgs(nflab.owner, addr1.address, BigInt(30*10**18));
      
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await nflab.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await nflab.transfer(addr1.address, BigInt(100 * 10**18) );

      // Transfer another 50 tokens from owner to addr2.
      await nflab.transfer(addr2.address, BigInt(50 * 10**18) );

      // Check balances.
      const finalOwnerBalance = await nflab.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(BigInt(initialOwnerBalance) - BigInt(150 * 10**18) );

      const addr1Balance = await nflab.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(BigInt(100 * 10**18) );

      const addr2Balance = await nflab.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(BigInt(50 * 10**18) );
    });
  });
});
