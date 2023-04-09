const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

const JobListings = artifacts.require("JobListings");

contract("JobListings", ([company]) => {
    let jobListings;

    const jobListingTitle = "Test job listing";
    const jobListingDescription = "This is a test job listing";
    const jobListingSalary = new BN("2500");
    const jobListingIpfsHash = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";

    beforeEach(async () => {
        jobListings = await JobListings.new();
    });

    it("should allow a company to create a job listing", async () => {
        await jobListings.createListing(
            jobListingTitle,
            jobListingDescription,
            jobListingSalary,
            jobListingIpfsHash,
            { from: company }
        );

        const listing = await jobListings.getListing(1);
        expect(listing.title).to.equal(jobListingTitle);
        expect(listing.description).to.equal(jobListingDescription);
        expect(listing.salary).to.be.bignumber.equal(jobListingSalary);
        expect(listing.company).to.equal(company);
        expect(listing.ipfsHash).to.equal(jobListingIpfsHash);
    });

    it("should allow a company to get their listings", async () => {
        await jobListings.createListing(
            jobListingTitle,
            jobListingDescription,
            jobListingSalary,
            jobListingIpfsHash,
            { from: company }
        );

        const listings = await jobListings.getListingsByCompany(company);
        expect(listings.length).to.equal(1);
    });

    it("should return the correct number of listings", async () => {
        await jobListings.createListing(
            jobListingTitle,
            jobListingDescription,
            jobListingSalary,
            jobListingIpfsHash,
            { from: company }
        );
        await jobListings.createListing(
            "Another job listing",
            "This is another job listing",
            jobListingSalary,
            jobListingIpfsHash,
            { from: company }
        );

        const count = await jobListings.getListingCount();
        expect(count).to.be.bignumber.equal(new BN("2"));
    });
});
