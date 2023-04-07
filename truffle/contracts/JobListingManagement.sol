// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./UserManagement.sol";

contract JobListings {
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

contract JobListingsManagement is ERC721URIStorage, UserManagement {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    JobListings private _jobListings;

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

    constructor(
        address jobListingsContractAddress,
        address tokenAddress
    ) ERC721("JobListingsNFT", "JLN") {
        _jobListings = JobListings(jobListingsContractAddress);
        _token = IERC20(tokenAddress);
    }

    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        str = string(bstr);
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

        return newTokenId;
    }

    function getJobListing(
        uint256 tokenId
    ) public view returns (JobListings.JobListing memory) {
        uint256 listingId = tokenId;
        return _jobListings.getListing(listingId);
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
