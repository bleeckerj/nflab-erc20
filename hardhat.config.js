require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const config = require("./.config.json");


const ALCHEMY_API_KEY = "KEY";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("config", "Prints the config stuff", async (taskArgs, hre) => {
  console.log(config.RINKEBY_PRIVATE_KEY);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/n3IyFvGpB00v0bapUmMspjItMHGMUG9k",
      accounts: [`${config.MUMBAI_PRIVATE_KEY}`]
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/VjqlOXyW6-H7WBCSMA4HznWy6i4keh8o`,
      accounts: [`${config.RINKEBY_PRIVATE_KEY}`]
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/Aa-uvzdPMHfedBcC7uGSZpvWgeXz7TTR`,
      accounts: [`${config.MATIC_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "GXG54RXPVUMNTWIBB6X8UWWCWIYH121VMS"
  }
};
