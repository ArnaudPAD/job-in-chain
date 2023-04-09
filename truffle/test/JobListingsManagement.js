const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

const JobListings = artifacts.require("JobListings");

contract("JobListings", ([company, candidate]) => {
    let jobListings;

    const jobListingTitle = "Test job listing";
    const jobListingDescription = "This is a test job listing";
    const jobListingSalary = new BN(2500);
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
        expect(listing.salary).to.bignumber.equal(jobListingSalary);
        expect(listing.company).to.equal(company);
        expect(listing.ipfsHash).to.equal(jobListingIpfsHash);

        const listingsByCompany = await jobListings.getListingsByCompany(
            company
        );
        expect(listingsByCompany.length).to.equal(1);
        expect(listingsByCompany[0]).to.bignumber.equal(1);

        const listingCount = await jobListings.getListingCount();
        expect(listingCount).to.bignumber.equal(1);
    });

    it("should not allow a non-company to create a job listing", async () => {
        await expectRevert(
            jobListings.createListing(
                jobListingTitle,
                jobListingDescription,
                jobListingSalary,
                jobListingIpfsHash,
                { from: candidate }
            ),
            "Ownable: caller is not the owner"
        );
    });
});

