const JobInChainToken = artifacts.require("JobInChainToken");
const JobInChainTokenSale = artifacts.require("JobInChainTokenSale");
const UserManagement = artifacts.require("UserManagement");
const JobListings = artifacts.require("JobListings");
const JobListingsManagement = artifacts.require("JobListingsManagement");
const JobApplicationManagement = artifacts.require("JobApplicationManagement");

module.exports = async function (deployer, network, accounts) {
  // Deploy JobInChainToken with a total supply of 1,000,000
  await deployer.deploy(JobInChainToken, "1000000000000000000000000");
  const tokenInstance = await JobInChainToken.deployed();

  // Deploy JobInChainTokenSale with the JobInChainToken address, a rate of 1000, and the initial supply of tokens
  await deployer.deploy(JobInChainTokenSale, tokenInstance.address, "1000", "1000000000000000000000000");
  const tokenSaleInstance = await JobInChainTokenSale.deployed();

  // Deploy UserManagement contract
  await deployer.deploy(UserManagement);
  const userManagementInstance = await UserManagement.deployed();

  // Deploy JobListings contract
  await deployer.deploy(JobListings);
  const jobListingsInstance = await JobListings.deployed();

  // Deploy JobListingsManagement contract with required addresses
  await deployer.deploy(
    JobListingsManagement,
    jobListingsInstance.address
  );
  const jobListingsManagementInstance = await JobListingsManagement.deployed();


  // Deploy JobApplicationManagement contract with required addresses
  await deployer.deploy(
    JobApplicationManagement,
    jobListingsInstance.address,
    userManagementInstance.address
  );
  const jobApplicationManagementInstance = await JobApplicationManagement.deployed();

  // Set the JobInChainTokenSale instance as the minter for the JobInChainToken
  await tokenInstance.addMinter(tokenSaleInstance.address);

  // Transfer some tokens to the JobInChainTokenSale contract for sale
  await tokenInstance.transfer(tokenSaleInstance.address, "500000000000000000000000");

  // Log the contract addresses for reference
  console.log("JobInChainToken address:", tokenInstance.address);
  console.log("JobInChainTokenSale address:", tokenSaleInstance.address);
  console.log("UserManagement address:", userManagementInstance.address);
  console.log("JobListings address:", jobListingsInstance.address);
  console.log("JobListingsManagement address:", jobListingsManagementInstance.address);
  console.log("JobApplicationManagement address:", jobApplicationManagementInstance.address);
};
