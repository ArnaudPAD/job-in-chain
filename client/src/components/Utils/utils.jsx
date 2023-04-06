import { useNavigate } from "react-router-dom";

const utils = {


  // Générez 50 offres d'emploi factices
  createFakeJobOffers: () => {
    const fakeJobs = [];

    for (let i = 1; i <= 50; i++) {
      fakeJobs.push({
        id: i,
        title: `Offre d'emploi ${i}`,
        salary: `${i * 1000} € brut`,
        company: `Company de l'id ${i}`,
        description: `Description de l'offre d'emploi ${i}`,
        details: `Détails supplémentaires sur l'offre d'emploi ${i}`,
        canApply: Math.random() < 0.8, // 80% de chance que les employeurs puissent postuler
      });
    }

    return fakeJobs;
  },

  getStatus: async (contract, accounts) => {
    try {
      if (await contract.methods.workflowStatus().call({ from: accounts[0] })) {
        // let start = await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
        let status = await contract.methods
          .workflowStatus()
          .call({ from: accounts[0] });
        return status;
      }
    } catch (error) {
      console.log(error);
    }
  },

  getOwner: async (contract, accounts) => {
    try {
      if (await contract?.methods?.owner().call({ from: accounts[0] })) {
        // let start = await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
        let status = await contract.methods.owner().call({ from: accounts[0] });

        console.log("owner", status);
        return status;
      }
    } catch (error) {
      console.log(error);
    }
  },

  getUserByAdress: async (contract, accounts, setVoter) => {
    try {
      console.log("lalala");
      if (
        await contract.methods.getUserByAddress(accounts[0]).call({ from: accounts[0] })
      ) {

        let voter = await contract.methods
          .getUserByAddress(accounts[0])
          .call({ from: accounts[0] });

        console.log("hihio", voter);
        return voter

      } else {
        console.log("icici");
      }
    } catch (error) {
      console.log(
        error.message.split(
          "VM Exception while processing transaction: revert"
        )[1]
      );
    }
  },

  createUser: async (contract, accounts, body) => {
    try {
      console.log(body);
      if (
        await contract.methods.createUser(0, "a@a.com", "a").call({ from: accounts[0] })
      ) {
        let newUser = contract.methods.createUser(body.role, body.email, body.name)
          .send({ from: accounts[0] });
        console.log("newUser", newUser);
      }
    } catch (error) {
      console.log(error);
      alert(
        error.message.split(
          "VM Exception while processing transaction: revert"
        )[1]
      );
    }
  }
};

export default utils;
