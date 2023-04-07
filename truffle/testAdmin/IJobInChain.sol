// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "./UserManagement.sol";
import "./JobInChainToken.sol";

interface IUserManagement {
    // Interface userManagement
    function createUser(
        UserManagement.UserType _userType,
        string calldata _name,
        string calldata _email,
        string calldata _companyName,
        string calldata _kyc,
        string calldata _candidateInfo
    ) external returns (uint256);

    function createDegree(
        string calldata _institution,
        string calldata _title,
        string calldata _year
    ) external;

    function createExperience(
        string calldata _companyName,
        string calldata _position,
        string calldata _beginDate,
        string calldata _endDate,
        string calldata _description
    ) external;

    function verifyDegree(uint256 _degreeId) external;

    function verifyExperience(uint256 _experienceId) external;

    function rejectDegree(uint256 _degreeId) external;

    function rejectExperience(uint256 _experienceId) external;

    function getUserByAddress(
        address _address
    ) external view returns (UserManagement.User memory);

    function getUserIdByAddress(
        address _address
    ) external view returns (uint256);

    function getUserById(
        uint256 _id
    ) external view returns (UserManagement.User memory);

    function getUserDegrees(
        uint256 _userId
    ) external view returns (UserManagement.Degree[] memory);

    function getUserExperiences(
        uint256 _userId
    ) external view returns (UserManagement.Experience[] memory);

    function getAllPendingExperiences()
        external
        view
        returns (UserManagement.Experience[] memory);

    function getAllPendingDegrees()
        external
        view
        returns (UserManagement.Degree[] memory);

    // Interface JobInChainToken
    function addMinter(address minter) external;

}
