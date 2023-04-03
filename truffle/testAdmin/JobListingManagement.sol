// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";


contract JobListings  {
    using Counters for Counters.Counter;
    Counters.Counter private _listingIds;
    struct JobListing {
        string title;
        string description;
        uint256 salary;
        address company;
    }

    mapping(uint256 => JobListing) private _listings;

    function createListing(
        string memory title,
        string memory description,
        uint256 salary
    ) public {
        _listingIds.increment();
        uint256 newListingId = _listingIds.current();
        _listings[newListingId] = JobListing(
            title,
            description,
            salary,
            msg.sender
        );
    }

    function getListing(
        uint256 listingId
    ) public view returns (JobListing memory) {
        return _listings[listingId];
    }
}

contract JobListingsNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    JobListings private _jobListings;
    mapping(uint256 => JobListings.JobListing) private _listings;

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

    constructor(
        address jobListingsContractAddress,
        address tokenAddress
    ) ERC721("JobListingsNFT", "JLN") {
        _jobListings = JobListings(jobListingsContractAddress);
        _token = IERC20(tokenAddress);
    }

    function createJobListingNFT(uint256 listingId) public returns (uint256) {
        JobListings.JobListing memory listing = _jobListings.getListing(
            listingId
        );
        require(
            listing.company == msg.sender,
            "Only the company can create a job listing NFT"
        );

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(
            newTokenId,
            string(
                abi.encodePacked(
                    "https://example.com/job-listings-nft/",
                    uint2str(newTokenId)
                )
            )
        );
        _listings[newTokenId] = listing;
        return newTokenId;
    }

    function getJobListing(
        uint256 tokenId
    ) public view returns (JobListings.JobListing memory) {
        return _listings[tokenId];
    }

    function applyForJob(uint256 tokenId, string memory message) public {
        JobListings.JobListing memory listing = _listings[tokenId];
        require(
            listing.company != msg.sender,
            "Employers cannot apply for job listings"
        );

        JobApplication[] storage applications = _jobApplications[tokenId];
        uint256 applicationId = applications.length + 1;
        applications.push(
            JobApplication(
                applicationId,
                tokenId,
                users[msg.sender].id,
                message,
                false,
                false
            )
        );

        emit JobApplicationCreated(
            applicationId,
            tokenId,
            users[msg.sender].id
        );
    }

    function getJobApplications(
        uint256 tokenId
    ) public view returns (JobApplication[] memory) {
        return _jobApplications[tokenId];
    }

    function hireCandidate(uint256 tokenId, uint256 applicationId) public {
        JobApplication storage application = _jobApplications[tokenId][
            applicationId
        ];
        require(
            application.jobListingId == tokenId,
            "Application does not correspond to the job listing"
        );

        JobListings.JobListing memory listing = _listings[tokenId];
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
        require(
            _token.transferFrom(
                msg.sender,
                users[application.candidateId].walletAddress,
                bounty
            ),
            "Token transfer failed"
        );

        emit CandidateHired(tokenId, applicationId);
    }

    function rejectCandidate(uint256 tokenId, uint256 applicationId) public {
        JobApplication storage application = _jobApplications[tokenId][
            applicationId
        ];
        require(
            application.jobListingId == tokenId,
            "Application does not correspond to the job listing"
        );

        JobListings.JobListing memory listing = _listings[tokenId];
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
