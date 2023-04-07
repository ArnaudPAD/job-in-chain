const UserManagement = artifacts.require("UserManagement");
const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

contract("UserManagement", ([owner, addr1, addr2]) => {
  let userManagement;

  beforeEach(async function () {
    userManagement = await UserManagement.new({ from: owner });
  });

  describe("Create user", () => {
    it("should create a new user", async () => {
      const result = await userManagement.createUser(
        0,
        "Alice",
        "alice@example.com",
        "",
        "",
        "Alice's candidate info",
        { from: addr1 }
      );

      expectEvent(result, "UserCreated", {
        id: new BN(1),
        userType: new BN(0),
        name: "Alice",
        email: "alice@example.com",
      });

      const user = await userManagement.getUserByAddress(addr1);
      expect(user.userType.toString()).to.equal("0");
      expect(user.name).to.equal("Alice");
      expect(user.email).to.equal("alice@example.com");
    });

    it("should revert when creating a user with invalid userType", async () => {
      await expectRevert.unspecified(
        userManagement.createUser(
          2,
          "Invalid User",
          "invalid@example.com",
          "",
          "",
          "Invalid candidate info",
          { from: addr1 }
        )
      );
    });
  });

  describe("Create degree", () => {
    it("should create a new degree for job seeker", async () => {
      await userManagement.createUser(
        0,
        "Alice",
        "alice@example.com",
        "",
        "",
        "Alice's candidate info",
        { from: addr1 }
      );

      const result = await userManagement.createDegree(
        "Example University",
        "Bachelor of Science",
        "2021",
        { from: addr1 }
      );

      expectEvent(result, "DegreeCreated", {
        id: new BN(1),
        userId: new BN(1),
        institution: "Example University",
        title: "Bachelor of Science",
        year: "2021",
        status: "Pending",
      });
    });

    it("should revert when creating a degree for non-job seeker", async () => {
      await userManagement.createUser(
        1,
        "Acme Corp",
        "acme@example.com",
        "Acme Corp",
        "Acme KYC",
        "",
        { from: addr1 }
      );

      await expectRevert(
        userManagement.createDegree(
          "Example University",
          "Bachelor of Science",
          "2021",
          { from: addr1 }
        ),
        "Only JobSeekers can access this functionality"
      );
    });
  });

  // Add tests for createExperience
  describe("Create experience", () => {
    beforeEach(async () => {
      await userManagement.createUser(
        0,
        "Alice",
        "alice@example.com",
        "",
        "",
        "Alice's candidate info",
        { from: addr2 }
      );
    });

    it("should create a new experience for job seeker", async () => {
      await userManagement.createExperience(
        "Test Company",
        "Test Position",
        "2022-01-01",
        "2022-04-01",
        "Test description",
        { from: addr2 }
      );
      const experiences = await userManagement.getUserExperiences(1);
      expect(experiences.length).to.equal(1);
      expect(experiences[0].companyName).to.equal("Test Company");
    });

    it("should revert when creating an experience for non-job seeker", async () => {
      await userManagement.createUser(
        1,
        "Acme Corp",
        "acme@example.com",
        "Acme Corp",
        "Acme KYC",
        "",
        { from: addr1 }
      );

      await expectRevert(
        userManagement.createExperience(
          "Test Company",
          "Test Position",
          "2022-01-01",
          "2022-04-01",
          "Test description",
          { from: addr1 }
        ),
        "Only JobSeekers can access this functionality"
      );
    });
  });

  // Add tests for verifyDegree and getUserDegrees
  describe("Verify degree and get user degrees", () => {
    beforeEach(async () => {
      await userManagement.createUser(
        0,
        "Alice",
        "alice@example.com",
        "",
        "",
        "Alice's candidate info",
        { from: addr2 }
      );
      await userManagement.createDegree(
        "Example University",
        "Bachelor of Science",
        "2021",
        { from: addr2 }
      );
    });
    // Test for verifyDegree and getUserDegrees
    it("should verify a degree and retrieve user degrees", async () => {
      const degreeId = 1;
      await userManagement.verifyDegree(degreeId, { from: owner });
      const degrees = await userManagement.getUserDegrees(degreeId);
      expect(degrees.length).to.equal(1);
      expect(degrees[0].status).to.equal("Valide"); // Change "Valide" to "Verified"
    });
  });

  // Add tests for verifyExperience and getUserExperiences
  describe("Verify experience and get user experiences", () => {
    beforeEach(async () => {
      await userManagement.createUser(
        0,
        "Alice",
        "alice@example.com",
        "",
        "",
        "Alice's candidate info",
        { from: addr2 }
      );
      await userManagement.createExperience(
        "Test Company",
        "Test Position",
        "2022-01-01",
        "2022-04-01",
        "Test description",
        { from: addr2 }
      );
    });
    // Test for verifyExperience and getUserExperiences
    it("should verify an experience and retrieve user experiences", async () => {
      const experienceId = 1;
      await userManagement.verifyExperience(experienceId, { from: owner });
      const experiences = await userManagement.getUserExperiences(experienceId);
      expect(experiences.length).to.equal(1);

      expect(experiences[0].status).to.equal("Valide"); // Change "Valide" to "Verified"
    });
  });
  // Add more tests for other functionalities like createExperience, verifyDegree, verifyExperience, getUserDegrees, and getUserExperiences
});

