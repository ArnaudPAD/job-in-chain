const JobInChainToken = artifacts.require("JobInChainToken");
const JobInChainTokenSale = artifacts.require("JobInChainTokenSale");
const UserManagement = artifacts.require("UserManagement");

module.exports = async function (deployer, network, accounts) {

  // Deploy JobInChainToken with a total supply of 1,000,000
  await deployer.deploy(JobInChainToken, "1000000000000000000000000");
  const tokenInstance = await JobInChainToken.deployed();

  // Deploy JobInChainTokenSale with the JobInChainToken address, a rate of 1000, and the initial supply of tokens
  await deployer.deploy(JobInChainTokenSale, tokenInstance.address, "1000", "1000000000000000000000000");

  // Deploy UserManagement contract
  await deployer.deploy(UserManagement);
  const userManagementInstance = await UserManagement.deployed();



  // Get the deployed instance of JobInChainTokenSale
  const tokenSaleInstance = await JobInChainTokenSale.deployed();

  // Set the JobInChainTokenSale instance as the minter for the JobInChainToken
  await tokenInstance.addMinter(tokenSaleInstance.address);

  // Transfer some tokens to the JobInChainTokenSale contract for sale
  await tokenInstance.transfer(tokenSaleInstance.address, "500000000000000000000000");




  // Log the contract addresses for reference
  console.log("JobInChainToken address:", tokenInstance.address);
  console.log("JobInChainTokenSale address:", tokenSaleInstance.address);
  console.log("UserManagement address:", userManagementInstance.address);

};
