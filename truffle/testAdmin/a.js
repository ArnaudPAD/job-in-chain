const JobInChainToken = artifacts.require("JobInChainToken");
const JobInChainTokenSale = artifacts.require("JobInChainTokenSale");
const UserManagement = artifacts.require("UserManagement");
const JobListingsManagement = artifacts.require("JobListingsManagement");
const JobListings = artifacts.require("JobListings");

module.exports = async function (deployer, network, accounts) {
    // Deploy JobInChainToken with a total supply of 1,000,000
    await deployer.deploy(JobInChainToken, "1000000000000000000000000");
    const tokenInstance = await JobInChainToken.deployed();

    // Deploy JobInChainTokenSale with the JobInChainToken address, a rate of 1000, and the initial supply of tokens
    await deployer.deploy(JobInChainTokenSale, tokenInstance.address, "1000", "1000000000000000000000000");

    // Deploy UserManagement contract
    await deployer.deploy(UserManagement);
    const userManagementInstance = await UserManagement.deployed();

    console.log("userManagementAddress", userManagementInstance.address)

    // Get the deployed instance of JobInChainTokenSale
    const tokenSaleInstance = await JobInChainTokenSale.deployed();


    // Deploy UserManagement contract
    await deployer.deploy(JobListings);
    const JobListingsInstance = await JobListings.deployed();
    // Deploy UserManagement contract
    await deployer.deploy(JobListingsManagement, JobListingsInstance.address, tokenInstance.address, userManagementInstance.address, { gas: 5000000000 });
    const JobListingsManagementInstance = await JobListingsManagement.deployed();
    console.log("dsqdqsdsq", JobListingsManagementInstance);
    // Set the JobInChainTokenSale instance as the minter for the JobInChainToken
    await tokenInstance.addMinter(tokenSaleInstance.address);

    // Transfer some tokens to the JobInChainTokenSale contract for sale
    await tokenInstance.transfer(tokenSaleInstance.address, "500000000000000000000000");


};