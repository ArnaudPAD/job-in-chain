const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

const UserManagement = artifacts.require("UserManagement");

contract("UserManagement", (accounts) => {
  const [owner, user1, user2] = accounts;
  let userManagement;

  beforeEach(async () => {
    userManagement = await UserManagement.new({ from: owner });
  });

  describe("User creation", () => {
    it("should create a new JobSeeker user", async () => {
      const receipt = await userManagement.createUser(
        0,
        "Alice",
        "alice@example.com",
        "",
        "",
        "JobSeeker information",
        { from: user1 }
      );

      expectEvent(receipt, "UserCreated", {
        id: new BN(1),
        userType: new BN(0),
        name: "Alice",
        email: "alice@example.com",
      });

      const user = await userManagement.getUserByAddress(user1);
      expect(user.id.toString()).to.equal("1");
      expect(user.userType.toString()).to.equal("0");
      expect(user.name).to.equal("Alice");
      expect(user.email).to.equal("alice@example.com");
      expect(user.isVerified).to.equal(false);
    });

    it("should create a new Employer user", async () => {
      const receipt = await userManagement.createUser(
        1,
        "Bob",
        "bob@example.com",
        "ACME Corp",
        "Some KYC data",
        "",
        { from: user2 }
      );

      expectEvent(receipt, "UserCreated", {
        id: new BN(1),
        userType: new BN(1),
        name: "Bob",
        email: "bob@example.com",
      });

      const user = await userManagement.getUserByAddress(user2);
      expect(user.id.toString()).to.equal("1");
      expect(user.userType.toString()).to.equal("1");
      expect(user.name).to.equal("Bob");
      expect(user.email).to.equal("bob@example.com");
      expect(user.companyName).to.equal("ACME Corp");
      expect(user.kyc).to.equal("Some KYC data");
      expect(user.isVerified).to.equal(false);
    });
  });

  describe("Degree management", () => {
    beforeEach(async () => {
      await userManagement.createUser(
        0,
        "Alice",
        "alice@example.com",
        "",
        "",
        "JobSeeker information",
        { from: user1 }
      );
    });

    it("should allow owner to create a degree for a user", async () => {
      const receipt = await userManagement.createDegree(
        1,
        "Some University",
        "Bachelor of Science",
        "2020",
        { from: owner }
      );

      expectEvent(receipt, "DegreeCreated", {
        id: new BN(1),
        userId: new BN(1),
        institution: "Some University",
        title: "Bachelor of Science",
        year: "2020"
      });

      const degree = await userManagement.getDegree(1);
      expect(degree.id.toString()).to.equal("1");
      expect(degree.userId.toString()).to.equal("1");
      expect(degree.institution).to.equal("Some University");
      expect(degree.title).to.equal("Bachelor of Science");
      expect(degree.year).to.equal("2020");
      expect(degree.isVerified).to.equal(false);
    });

    it("should not allow non-owner to create a degree", async () => {
      await expectRevert(
        userManagement.createDegree(
          1,
          "Some University",
          "Bachelor of Science",
          "2020",
          { from: user1 }
        ),
        "Ownable: caller is not the owner"
      );
    });

    it("should allow owner to verify a degree", async () => {
      await userManagement.createDegree(
        1,
        "Some University",
        "Bachelor of Science",
        "2020",
        { from: owner }
      );

      const receipt = await userManagement.verifyDegree(1, { from: owner });

      expectEvent(receipt, "DegreeVerified", {
        id: new BN(1),
      });

      const degree = await userManagement.getDegree(1);
      expect(degree.isVerified).to.equal(true);
    });

    it("should allow owner to verify a degree", async () => {
      await userManagement.createDegree(
        1,
        "Some University",
        "Bachelor of Science",
        "2020",
        { from: owner }
      );

      const receipt = await userManagement.verifyDegree(1, { from: owner });

      expectEvent(receipt, "DegreeVerified", {
        id: new BN(1),
      });

      const degree = await userManagement.getDegree(1);
      expect(degree.isVerified).to.equal(true);
    });
  });

  describe("Experience management", () => {
    beforeEach(async () => {
      await userManagement.createUser(
        0,
        "Alice",
        "alice@example.com",
        "",
        "",
        "JobSeeker information",
        { from: user1 }
      );
    });
    it("should allow owner to create an experience for a user", async () => {
      const receipt = await userManagement.createExperience(
        1,
        "ACME Corp",
        "Software Engineer",
        "01/01/2021",
        "01/01/2022",
        "Description of experience",
        { from: owner }
      );

      expectEvent(receipt, "ExperienceCreated", {
        id: new BN(1),
        userId: new BN(1),
        companyName: "ACME Corp",
        position: "Software Engineer",
        beginDate: "01/01/2021",
        endDate: "01/01/2022",
        description: "Description of experience",
      });

      const experience = await userManagement.getExperience(1);
      expect(experience.id.toString()).to.equal("1");
      expect(experience.userId.toString()).to.equal("1");
      expect(experience.companyName).to.equal("ACME Corp");
      expect(experience.position).to.equal("Software Engineer");
      expect(experience.beginDate).to.equal("01/01/2021");
      expect(experience.endDate).to.equal("01/01/2022");
      expect(experience.description).to.equal("Description of experience");
      expect(experience.isVerified).to.equal(false);
    });

    it("should not allow non-owner to create an experience", async () => {
      await expectRevert(
        userManagement.createExperience(
          1,
          "ACME Corp",
          "Software Engineer",
          "01/01/2021",
          "01/01/2022",
          "Description of experience",
          { from: user1 }
        ),
        "Ownable: caller is not the owner"
      );
    });
    it("should allow owner to verify an experience", async () => {
      await userManagement.createExperience(
        1,
        "ACME Corp",
        "Software Engineer",
        "01/01/2021",
        "01/01/2022",
        "Description of experience",
        { from: owner }
      );

      const receipt = await userManagement.verifyExperience(1, { from: owner });

      expectEvent(receipt, "ExperienceVerified", {
        id: new BN(1),
      });

      const experience = await userManagement.getExperience(1);
      expect(experience.isVerified).to.equal(true);
    });


    it("should not allow non-owner to verify an experience", async () => {
      await userManagement.createExperience(
        1,
        "ACME Corp",
        "Software Engineer",
        "01/01/2021",
        "01/01/2022",
        "Description of experience",
        { from: owner }
      );

      await expectRevert(
        userManagement.verifyExperience(1, { from: user1 }),
        "Ownable: caller is not the owner"
      );
    });
  });
});