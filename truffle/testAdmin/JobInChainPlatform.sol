// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./IJobInChainPlatform.sol";
import "./UserManagement.sol";
import "./JobInChainToken.sol";
import "./JobInChainTokenSale.sol";

contract JobInChainPlatform is IJobInChainPlatform, UserManagement {
    JobInChainToken private jobInChainToken;
    JobInChainTokenSale private jobInChainTokenSale;

    constructor(address _jobInChainToken, address _jobInChainTokenSale) {
        jobInChainToken = JobInChainToken(_jobInChainToken);
        jobInChainTokenSale = JobInChainTokenSale(_jobInChainTokenSale);
    }

    function createUser(
        UserType _userType,
        string calldata _name,
        string calldata _email,
        string calldata _companyName,
        string calldata _kyc,
        string calldata _candidateInfo
    ) external virtual returns (uint256) {
        return
            createUser(
                _userType,
                _name,
                _email,
                _companyName,
                _kyc,
                _candidateInfo
            );
    }

    function getUserByAddress(
        address _address
    ) external view virtual returns (User memory) {
        return getUserByAddress(_address);
    }

    function createDegree(
        string calldata _institution,
        string calldata _title,
        string calldata _year
    ) external virtual {
        UserManagement.createDegree(_institution, _title, _year);
    }

    function createExperience(
        string calldata _companyName,
        string calldata _position,
        string calldata _beginDate,
        string calldata _endDate,
        string calldata _description
    ) external virtual {
        UserManagement.createExperience(
            _companyName,
            _position,
            _beginDate,
            _endDate,
            _description
        );
    }

    function addMinter(address minter) external override {
        jobInChainToken.addMinter(minter);
    }

    function isMinter(address account) external view override returns (bool) {
        return jobInChainToken.isMinter(account);
    }

    function mint(address account, uint256 amount) external override {
        jobInChainToken.mint(account, amount);
    }

    function buyTokens() external payable override {
        jobInChainTokenSale.buyTokens{value: msg.value}(msg.sender);
    }

    function updateRate(uint256 _newRate) external override {
        jobInChainTokenSale.updateRate(_newRate);
    }

    function grantTokens(address _employee, uint256 _amount) external override {
        jobInChainTokenSale.grantTokens(_employee, _amount);
    }

    function withdrawTokens() external override {
        jobInChainTokenSale.withdrawTokens();
    }
}
