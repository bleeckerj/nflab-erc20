# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

# Some Notes
Deploying the token to a test or mainnet — in order to verify the compiled code run
npx hardhat flatten > flatten.sol

Then you'll need to remove all the repeated `// SPX` comments because the verifier treats those not as comments but as semantics, and will complain that there are multiples. Weird.