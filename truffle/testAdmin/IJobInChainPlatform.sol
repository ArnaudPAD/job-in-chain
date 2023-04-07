// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserManagement.sol";
import "./JobInChainToken.sol";
import "./JobInChainTokenSale.sol";

interface IJobInChainPlatform {
    function createUser(
        UserManagement.UserType _userType,
        string calldata _name,
        string calldata _email,
        string calldata _companyName,
        string calldata _kyc,
        string calldata _candidateInfo
    ) external returns (uint256);

    function getUserByAddress(
        address _address
    ) external view returns (UserManagement.User memory);

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

    function addMinter(address minter) external;

    function isMinter(address account) external view returns (bool);

    function mint(address account, uint256 amount) external;

    function buyTokens() external payable;

    function updateRate(uint256 _newRate) external;

    function grantTokens(address _employee, uint256 _amount) external;

    function withdrawTokens() external;
}
