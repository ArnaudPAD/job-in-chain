// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract UserManagement is Ownable {
    enum UserType {
        JobSeeker,
        Employer
    }

    struct User {
        uint256 id;
        UserType userType;
        string name;
        string email;
        string companyName; // Uniquement pour les entreprises
        string kyc; // KYC pour les entreprises
        string candidateInfo; // Infos spécifiques pour les candidats
        bool isVerified;
    }

    struct Degree {
        uint256 id;
        uint256 userId;
        string institution;
        string title;
        string year;
        bool isVerified;
    }

    struct Experience {
        uint256 id;
        uint256 userId;
        string companyName;
        string position;
        string beginDate;
        string endDate;
        string description;
        bool isVerified;
    }

    mapping(address => User) private usersByAddress;
    mapping(uint256 => User) private usersById;
    mapping(uint256 => Degree) private degrees;
    mapping(uint256 => Experience) private experiences;
    uint256 private userIdCounter;
    uint256 private degreeIdCounter;
    uint256 private experienceIdCounter;

    event DegreeCreated(
        uint256 indexed id,
        uint256 indexed userId,
        string institution,
        string title,
        string year
    );
    event ExperienceCreated(
        uint256 indexed id,
        uint256 indexed userId,
        string companyName,
        string position,
        string beginDate,
        string endDate,
        string description
    );

    event UserCreated(
        uint256 indexed id,
        UserType userType,
        string name,
        string email
    );

    event DegreeVerified(uint256 indexed id);
    event ExperienceVerified(uint256 indexed id);

    function createUser(
        UserType _userType,
        string memory _name,
        string memory _email,
        string memory _companyName, // Uniquement pour les entreprises
        string memory _kyc, // KYC pour les entreprises
        string memory _candidateInfo // Infos spécifiques pour les candidats
    ) public {
        userIdCounter++;
        User memory user = User(
            userIdCounter,
            _userType,
            _name,
            _email,
            _companyName,
            _kyc,
            _candidateInfo,
            false
        );
        usersByAddress[msg.sender] = user;
        usersById[userIdCounter] = user;
        emit UserCreated(userIdCounter, _userType, _name, _email);
    }

    function getUserByAddress(
        address _address
    ) public view returns (User memory) {
        return usersByAddress[_address];
    }

    function getUserById(uint256 _id) public view returns (User memory) {
        return usersById[_id];
    }

    function createDegree(
        uint256 _userId,
        string memory _institution,
        string memory _title,
        string memory _year
    ) public onlyOwner {
        degreeIdCounter++;
        Degree memory degree = Degree(
            degreeIdCounter,
            _userId,
            _institution,
            _title,
            _year,
            false
        );
        degrees[degreeIdCounter] = degree;
        emit DegreeCreated(
            degreeIdCounter,
            _userId,
            _institution,
            _title,
            _year
        );
    }

    function verifyDegree(uint256 _degreeId) public onlyOwner {
        degrees[_degreeId].isVerified = true;
        emit DegreeVerified(_degreeId);
    }

    function getDegree(uint256 _id) public view returns (Degree memory) {
        return degrees[_id];
    }

    function createExperience(
        uint256 _userId,
        string memory _companyName,
        string memory _position,
        string memory _beginDate,
        string memory _endDate,
        string memory _description
    ) public onlyOwner {
        experienceIdCounter++;
        Experience memory experience = Experience(
            experienceIdCounter,
            _userId,
            _companyName,
            _position,
            _beginDate,
            _endDate,
            _description,
            false
        );
        experiences[experienceIdCounter] = experience;
        emit ExperienceCreated(
            experienceIdCounter,
            _userId,
            _companyName,
            _position,
            _beginDate,
            _endDate,
            _description
        );
    }

    function verifyExperience(uint256 _experienceId) public onlyOwner {
        experiences[_experienceId].isVerified = true;
        emit ExperienceVerified(_experienceId);
    }

    function getExperience(
        uint256 _id
    ) public view returns (Experience memory) {
        return experiences[_id];
    }
}
