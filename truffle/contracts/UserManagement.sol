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
        string status;
    }

    struct Experience {
        uint256 id;
        uint256 userId;
        string companyName;
        string position;
        string beginDate;
        string endDate;
        string description;
        string status;
    }

    string public constant PENDING_STATUS = "Pending";
    string public constant VALID_STATUS = "Valide";
    mapping(address => User) private usersByAddress;
    mapping(uint256 => User) private usersById;
    mapping(uint256 => Degree) private degrees;
    mapping(uint256 => Experience) private experiences;
    mapping(uint256 => Degree[]) private userDegrees;
    mapping(uint256 => Experience[]) private userExperiences;
    uint256 private userIdCounter;
    uint256 private degreeIdCounter;
    uint256 private experienceIdCounter;

    event DegreeCreated(
        uint256 indexed id,
        uint256 indexed userId,
        string institution,
        string title,
        string year,
        string status
    );
    event ExperienceCreated(
        uint256 indexed id,
        uint256 indexed userId,
        string companyName,
        string position,
        string beginDate,
        string endDate,
        string description,
        string status
    );

    event UserCreated(
        uint256 indexed id,
        UserType userType,
        string name,
        string email
    );

    event DegreeVerified(uint256 indexed id);
    event ExperienceVerified(uint256 indexed id);

    modifier onlyJobSeeker() {
        require(
            usersByAddress[msg.sender].userType == UserType.JobSeeker,
            "Only JobSeekers can access this functionality"
        );
        _;
    }

    function createUser(
        UserType _userType,
        string memory _name,
        string memory _email,
        string memory _companyName,
        string memory _kyc,
        string memory _candidateInfo
    ) public returns (uint256) {
        require(
            _userType == UserType.JobSeeker || _userType == UserType.Employer,
            "Invalid user type"
        );

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

        return userIdCounter;
    }

    function getUserByAddress(
        address _address
    ) public view returns (User memory) {
        return usersByAddress[_address];
    }

    function getUserIdByAddress(
        address _address
    ) public view returns (uint256) {
        return usersByAddress[_address].id;
    }

    function getUserById(uint256 _id) public view returns (User memory) {
        return usersById[_id];
    }

    function createDegree(
        string memory _institution,
        string memory _title,
        string memory _year
    ) public onlyJobSeeker {
        uint256 userId = getUserIdByAddress(msg.sender);
        degreeIdCounter++;
        Degree memory degree = Degree(
            degreeIdCounter,
            userId,
            _institution,
            _title,
            _year,
            "Pending"
        );
        userDegrees[userId].push(degree);
        degrees[degreeIdCounter] = degree;
        emit DegreeCreated(
            degreeIdCounter,
            userId,
            _institution,
            _title,
            _year,
            PENDING_STATUS
        );
    }

    function createExperience(
        string memory _companyName,
        string memory _position,
        string memory _beginDate,
        string memory _endDate,
        string memory _description
    ) public onlyJobSeeker {
        uint256 userId = getUserIdByAddress(msg.sender);
        experienceIdCounter++;
        Experience memory experience = Experience(
            experienceIdCounter,
            userId,
            _companyName,
            _position,
            _beginDate,
            _endDate,
            _description,
            "Pending"
        );
        userExperiences[userId].push(experience);
        experiences[experienceIdCounter] = experience;
        emit ExperienceCreated(
            experienceIdCounter,
            userId,
            _companyName,
            _position,
            _beginDate,
            _endDate,
            _description,
            "Pending"
        );
    }

    function verifyDegree(uint256 _degreeId) public onlyOwner {
        require(
            _degreeId <= degreeIdCounter && _degreeId > 0,
            "Degree ID does not exist"
        );
        degrees[_degreeId].status = VALID_STATUS;
        Degree storage degree = degrees[_degreeId];
        userDegrees[degree.userId][_degreeId - 1].status = VALID_STATUS;
        emit DegreeVerified(_degreeId);
    }

    function verifyExperience(uint256 _experienceId) public onlyOwner {
        require(
            _experienceId <= experienceIdCounter && _experienceId > 0,
            "Experience ID does not exist"
        );
        experiences[_experienceId].status = VALID_STATUS;
        Experience storage experience = experiences[_experienceId];
        userExperiences[experience.userId][_experienceId - 1]
            .status = VALID_STATUS;
        emit ExperienceVerified(_experienceId);
    }

    function getUserDegrees(
        uint256 _userId
    ) public view returns (Degree[] memory) {
        return userDegrees[_userId];
    }

    function getUserExperiences(
        uint256 _userId
    ) public view returns (Experience[] memory) {
        return userExperiences[_userId];
    }

    function getAllPendingExperiences()
        public
        view
        onlyOwner
        returns (Experience[] memory)
    {
        uint256 totalExperiences = experienceIdCounter;
        uint256 count = 0;
        for (uint256 i = 1; i <= totalExperiences; i++) {
            if (
                keccak256(bytes(experiences[i].status)) ==
                keccak256(bytes(PENDING_STATUS))
            ) {
                count++;
            }
        }
        Experience[] memory result = new Experience[](count);
        count = 0;
        for (uint256 i = 1; i <= totalExperiences; i++) {
            if (
                keccak256(bytes(experiences[i].status)) ==
                keccak256(bytes(PENDING_STATUS))
            ) {
                result[count] = experiences[i];
                count++;
            }
        }
        return result;
    }

    function getAllPendingDegrees()
        public
        view
        onlyOwner
        returns (Degree[] memory)
    {
        uint256 totalDegrees = degreeIdCounter;
        uint256 count = 0;
        for (uint256 i = 1; i <= totalDegrees; i++) {
            if (
                keccak256(bytes(degrees[i].status)) ==
                keccak256(bytes(PENDING_STATUS))
            ) {
                count++;
            }
        }
        Degree[] memory result = new Degree[](count);
        count = 0;
        for (uint256 i = 1; i <= totalDegrees; i++) {
            if (
                keccak256(bytes(degrees[i].status)) ==
                keccak256(bytes(PENDING_STATUS))
            ) {
                result[count] = degrees[i];
                count++;
            }
        }
        return result;
    }
}
