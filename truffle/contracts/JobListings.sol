// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

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
