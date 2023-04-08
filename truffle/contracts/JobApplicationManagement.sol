// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./UserManagement.sol";
import "./JobListings.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract JobApplicationManagement is UserManagement {
    using Counters for Counters.Counter;
    Counters.Counter private _applicationId;
    struct JobApplication {
        uint256 applicationId;
        uint256 jobListingId;
        uint256 candidateId;
        string message;
        bool isHired;
        bool isRejected;
    }

    mapping(uint256 => JobApplication[]) private _jobApplications;
    event nftTransfert(address sender, address walletAddress, uint256 tokenId);
    IERC20 private _token;
    JobListings private _jobListings;
    IERC721 private _jobListingsManagement;

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

    event eventTest(address msgSender, address walletAddress, uint256 tokenId);

    constructor(
        address jobListingsContractAddress,
        address tokenAddress,
        address jobListingsManagementAddress
    ) {
        _jobListings = JobListings(jobListingsContractAddress);
        _token = IERC20(tokenAddress);
        _jobListingsManagement = IERC721(jobListingsManagementAddress);
    }

    function getJobListing(
        uint256 tokenId
    ) public view returns (JobListings.JobListing memory) {
        return _jobListings.getListing(tokenId);
    }

    function applyForJob(
        uint256 tokenId,
        string memory message,
        uint256 _userId
    ) public {
        JobApplication[] storage applications = _jobApplications[tokenId];
        _applicationId.increment();
        uint256 applicationId = _applicationId.current();

        applications.push(
            JobApplication(
                applicationId,
                tokenId,
                _userId,
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

    function hireCandidate(
        uint256 tokenId,
        uint256 applicationId,
        address walletAddress
    ) public {
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

        // Retirer le candidat accepté de la liste des candidats
        uint256 applicationsLength = _jobApplications[tokenId].length;
        for (uint256 i = applicationId - 1; i < applicationsLength - 1; i++) {
            _jobApplications[tokenId][i] = _jobApplications[tokenId][i + 1];
        }
        _jobApplications[tokenId].pop();

        // Transférer le NFT au candidat embauché
        emit eventTest(msg.sender, walletAddress, tokenId);
        // _jobListingsManagement.transferFrom(msg.sender, walletAddress, tokenId);

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

        // Retirer le candidat accepté de la liste des candidats
        uint256 applicationsLength = _jobApplications[tokenId].length;
        for (uint256 i = applicationId - 1; i < applicationsLength - 1; i++) {
            _jobApplications[tokenId][i] = _jobApplications[tokenId][i + 1];
        }
        _jobApplications[tokenId].pop();

        emit CandidateRejected(tokenId, applicationId);
    }
}
