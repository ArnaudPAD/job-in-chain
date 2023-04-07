// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./JobListings.sol";

contract JobListingsManagement is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    JobListings private _jobListings;

    constructor(
        address jobListingsContractAddress
    ) ERC721("JobListingsNFT", "JLN") {
        _jobListings = JobListings(jobListingsContractAddress);
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
}
