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

    // // Create the admin/employer user
    // await userManagementInstance.createUser(
    //   1, // Employer user type
    //   "Micheline",
    //   "jeanine@gmail.com",
    //   "Alyra.",
    //   "admin_kyc",
    //   "Experte recrutement Alyra",

    //   { from: accounts[0] } // The admin's account is accounts[0]
    // );

    // // Create the employee 1
    // await userManagementInstance.createUser(
    //   1, // JobSeeker user type
    //   "Jeanine Mansot",
    //   "jm@gmail.com",
    //   "IT Technology",
    //   "",
    //   "For the best innovation.",
    //   { from: accounts[1] } // The employee's account is accounts[1]
    // );

    // // Create the employee 2
    // await userManagementInstance.createUser(
    //   0, // JobSeeker user type
    //   "Francois Dubois",
    //   "dubois.francois@gmail.com",
    //   "",
    //   "",
    //   "",
    //   { from: accounts[2] } // The employee's account is accounts[2]
    // );

    // await userManagementInstance.createExperience(
    //   "ABC Corp.",
    //   "Web Developer",
    //   "01/01/2014",
    //   "01/01/2016",
    //   "Worked on a large e-commerce website",
    //   { from: accounts[2] } // Employee 2's account
    // );
    // await userManagementInstance.verifyExperience(2, { from: accounts[0] }); // Verify the first experience
    // await userManagementInstance.createExperience(
    //   "123 Inc.",
    //   "Software Developer",
    //   "01/01/2016",
    //   "01/01/2018",
    //   "Developed a mobile app",
    //   { from: accounts[2] } // Employee 2's account
    // );

    // // Create two degrees for each employee, one verified and one unverified
    // await userManagementInstance.createDegree(
    //   "MIT",
    //   "Computer Science",
    //   "2010",
    //   { from: accounts[1] } // Employee 1's account
    // );
    // await userManagementInstance.verifyDegree(1, { from: accounts[0] }); // Verify the first degree
    // await userManagementInstance.createDegree(
    //   "Stanford",
    //   "Software Engineering",
    //   "2012",
    //   { from: accounts[1] } // Employee 1's account
    // );
    // await userManagementInstance.createDegree(
    //   "Harvard",
    //   "Computer Science",
    //   "2014",
    //   { from: accounts[2] } // Employee 2's account
    // );
    // await userManagementInstance.verifyDegree(2, { from: accounts[0] }); // Verify the first degree
    // await userManagementInstance.createDegree(
    //   "MIT",
    //   "Software Engineering",
    //   "2016",
    //   { from: accounts[2] } // Employee 2's account
    // );


    // let user0 = await userManagementInstance.getUserByAddress(accounts[0], { from: accounts[0] })
    // console.log("user0", user0);
    // // Log the contract addresses for reference
    // console.log("JobInChainToken address:", tokenInstance.address);
    // console.log("JobInChainTokenSale address:", tokenSaleInstance.address);
    // console.log("UserManagement address:", userManagementInstance.address);
};