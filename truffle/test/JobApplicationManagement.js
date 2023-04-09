const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

const JobApplicationManagement = artifacts.require("JobApplicationManagement");

contract("JobApplicationManagement", ([company, candidate]) => {
    let jobApplicationManagement;

    beforeEach(async () => {
        jobApplicationManagement = await JobApplicationManagement.new();
    });

    it("should allow a candidate to apply for a job", async () => {
        const tokenId = new BN("12345678901234567890");
        const message = "I am interested in this job";
        await jobApplicationManagement.applyForJob(tokenId, message, {
            from: candidate,
        });

        const jobApplications = await jobApplicationManagement.getJobApplications(
            tokenId
        );
        expect(jobApplications.length).to.equal(1);
        expect(jobApplications[0].candidateId).to.be.bignumber.equal(new BN(candidate));
        expect(jobApplications[0].message).to.equal(message);
    });

    it("should not allow a candidate to apply for an invalid job listing", async () => {
        const invalidTokenId = new BN("98765432109876543210");
        const message = "I am interested in this job";
        await expectRevert(
            jobApplicationManagement.applyForJob(invalidTokenId, message, {
                from: candidate,
            }),
            "JobApplicationManagement: job listing does not exist"
        );
    });

    it("should allow a company to hire a candidate", async () => {
        const tokenId = new BN("12345678901234567890");
        const message = "I am interested in this job";
        await jobApplicationManagement.applyForJob(tokenId, message, {
            from: candidate,
        });

        await jobApplicationManagement.hireCandidate(tokenId, new BN(1), {
            from: company,
        });

        const jobApplications = await jobApplicationManagement.getJobApplications(
            tokenId
        );
        expect(jobApplications.length).to.equal(0);

        const owner = await jobApplicationManagement.ownerOf(tokenId);
        expect(owner).to.be.bignumber.equal(new BN(candidate));
    });

    it("should not allow a non-company to hire a candidate", async () => {
        const tokenId = new BN("12345678901234567890");
        const message = "I am interested in this job";
        await jobApplicationManagement.applyForJob(tokenId, message, {
            from: candidate,
        });

        await expectRevert(
            jobApplicationManagement.hireCandidate(tokenId, new BN(1), {
                from: candidate,
            }),
            "Only companies can hire candidates"
        );
    });

    it("should not allow hiring a candidate that has already been hired or rejected", async () => {
        const tokenId = new BN("12345678901234567890");
        const message = "I am interested in this job";
        await jobApplicationManagement.applyForJob(tokenId, message, {
            from: candidate,
        });

        await jobApplicationManagement.hireCandidate(tokenId, new BN(1), {
            from: company,
        });

        await expectRevert(
            jobApplicationManagement.hireCandidate(tokenId, new BN(1), {
                from: company,
            }),
            "Candidate has already been hired or rejected"
        );
    });

    it("should allow a company to reject a candidate", async () => {
        const tokenId = new BN("12345678901234567890");
        const message = "I am interested in this job";
        await jobApplicationManagement.applyForJob(tokenId, message, {
            from: candidate,
        });
        await jobApplicationManagement.rejectCandidate(tokenId, new BN(1), {
            from: company,
        });

        const jobApplications = await jobApplicationManagement.getJobApplications(
            tokenId
        );
        expect(jobApplications.length).to.equal(0);
    });

    it("should not allow a non-company to reject a candidate", async () => {
        const tokenId = new BN("12345678901234567890");
        const message = "I am interested in this job";
        await jobApplicationManagement.applyForJob(tokenId, message, {
            from: candidate,
        });
        await expectRevert(
            jobApplicationManagement.rejectCandidate(tokenId, new BN(1), {
                from: candidate,
            }),
            "Only companies can reject candidates"
        );
    });

    it("should not allow rejecting a candidate that has already been hired or rejected", async () => {
        const tokenId = new BN("12345678901234567890");
        const message = "I am interested in this job";
        await jobApplicationManagement.applyForJob(tokenId, message, {
            from: candidate,
        });
        await jobApplicationManagement.rejectCandidate(tokenId, new BN(1), {
            from: company,
        });

        await expectRevert(
            jobApplicationManagement.rejectCandidate(tokenId, new BN(1), {
                from: company,
            }),
            "Candidate has already been hired or rejected"
        );
        await jobApplicationManagement.rejectCandidate(tokenId, new BN(1), {
            from: company,
        });

        await expectRevert(
            jobApplicationManagement.rejectCandidate(tokenId, new BN(1), {
                from: company,
            }),
            "Candidate has already been hired or rejected"
        );
    });
});