// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./UserManagement.sol";
import "./JobListings.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract JobApplicationManagement is UserManagement {
    using Counters for Counters.Counter;

    struct JobApplication {
        uint256 applicationId;
        uint256 jobListingId;
        uint256 candidateId;
        string message;
        bool isHired;
        bool isRejected;
    }

    mapping(uint256 => JobApplication[]) private _jobApplications;

    IERC20 private _token;
    JobListings private _jobListings;

    event JobApplicationCreated(
        uint256 indexed applicationId,
        uint256 indexed tokenId,
        address indexed candidate
    );

    event CandidateHired(
        uint256 indexed tokenId,
        uint256 indexed applicationId
    );

    event CandidateRejected(
        uint256 indexed tokenId,
        uint256 indexed applicationId
    );

    constructor(address jobListingsContractAddress, address tokenAddress) {
        _jobListings = JobListings(jobListingsContractAddress);
        _token = IERC20(tokenAddress);
    }

    function getJobListing(
        uint256 tokenId
    ) public view returns (JobListings.JobListing memory) {
        return _jobListings.getListing(tokenId);
    }

    function applyForJob(uint256 tokenId, string memory message) public {
        JobListings.JobListing memory listing = getJobListing(tokenId);
        require(
            listing.company != msg.sender,
            "Employers cannot apply for job listings"
        );

        User memory user = getUserByAddress(msg.sender);
        JobApplication[] storage applications = _jobApplications[tokenId];
        uint256 applicationId = applications.length + 1;

        applications.push(
            JobApplication(
                applicationId,
                tokenId,
                user.id,
                message,
                false,
                false
            )
        );

        emit JobApplicationCreated(applicationId, tokenId, msg.sender);
    }

    function getJobApplications(
        uint256 tokenId
    ) public view returns (JobApplication[] memory) {
        return _jobApplications[tokenId];
    }

    function hireCandidate(uint256 tokenId, uint256 applicationId) public {
        JobApplication storage application = _jobApplications[tokenId][
            applicationId - 1
        ];

        JobListings.JobListing memory listing = getJobListing(tokenId);
        require(
            listing.company == msg.sender,
            "Only companies can hire candidates"
        );

        require(
            !application.isHired && !application.isRejected,
            "Candidate has already been hired or rejected"
        );

        application.isHired = true;
        uint256 bounty = listing.salary;
        User memory user = getUserById(application.candidateId);
        require(
            _token.transferFrom(msg.sender, user.walletAddress, bounty),
            "Token transfer failed"
        );

        emit CandidateHired(tokenId, applicationId);
    }

    function rejectCandidate(uint256 tokenId, uint256 applicationId) public {
        JobApplication storage application = _jobApplications[tokenId][
            applicationId - 1
        ];

        JobListings.JobListing memory listing = getJobListing(tokenId);
        require(
            listing.company == msg.sender,
            "Only companies can reject candidates"
        );

        require(
            !application.isHired && !application.isRejected,
            "Candidate has already been hired or rejected"
        );

        application.isRejected = true;

        emit CandidateRejected(tokenId, applicationId);
    }
}
