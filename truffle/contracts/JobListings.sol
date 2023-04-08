// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "./UserManagement.sol";

contract JobListings {
    using Counters for Counters.Counter;
    Counters.Counter private _listingIds;
    struct JobListing {
        string title;
        string description;
        uint256 salary;
        address company;
        string ipfsHash;
        uint256 tokenId;
    }

    event ListingCreated(
        uint256 indexed listingId,
        address indexed company,
        string ipfsHash
    );

    mapping(uint256 => JobListing) private _listings;
    mapping(address => uint256[]) private _listingsByCompany;

    function createListing(
        string memory title,
        string memory description,
        uint256 salary,
        string memory _ipfsHash
    ) public {
        _listingIds.increment();
        uint256 newListingId = _listingIds.current();
        _listings[newListingId] = JobListing(
            title,
            description,
            salary,
            msg.sender,
            _ipfsHash,
            newListingId
        );
        _listingsByCompany[msg.sender].push(newListingId);
        emit ListingCreated(newListingId, msg.sender, _ipfsHash);
    }

    function getListing(
        uint256 listingId
    ) public view returns (JobListing memory) {
        return _listings[listingId];
    }

    function getListingsByCompany(
        address company
    ) public view returns (uint256[] memory) {
        return _listingsByCompany[company];
    }

    function getListingCount() public view returns (uint256) {
        return _listingIds.current();
    }
}
