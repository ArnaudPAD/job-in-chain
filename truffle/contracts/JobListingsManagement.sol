// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

import "./JobListings.sol";

contract JobListingsManagement is ERC721URIStorage {
    using Counters for Counters.Counter;
    using Strings for uint256;
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
                    newTokenId.toString()
                )
            )
        );

        return newTokenId;
    }

    function transferJobListingNFT(uint256 tokenId, address to) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        _transfer(_msgSender(), to, tokenId);
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
}
