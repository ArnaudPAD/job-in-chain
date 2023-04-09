import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import JobApplicationManagementJSON from "../../contracts/JobApplicationManagement.json";
import JobListingsJSON from "../../contracts/JobListings.json";
import JobListingsManagementJSON from "../../contracts/JobListingsManagement.json";
import UserManagementJSON from "../../contracts/UserManagement.json";


function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async () => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const accounts = await web3.eth.requestAccounts();
    const networkID = await web3.eth.net.getId();

    const loadContract = async (artifact) => {

      console.log("arti", artifact)
      const { abi } = artifact;
      console.log("nid", networkID);

      let address, contract;


      try {
        address = artifact.networks[networkID].address;
        contract = new web3.eth.Contract(abi, address);
        console.log("adddddd", address);
        console.log("contract", contract)
      } catch (err) {
        console.error(err);
      }

      return contract;
    };


    const jobApplicationManagement = await loadContract(JobApplicationManagementJSON);
    const jobListings = await loadContract(JobListingsJSON);
    const jobListingsManagement = await loadContract(JobListingsManagementJSON);
    const userManagement = await loadContract(UserManagementJSON);


    dispatch({
      type: actions.init,
      data: {
        web3,
        accounts,
        networkID,
        jobApplicationManagement,
        jobListings,
        jobListingsManagement,
        userManagement,
      },
    });
  }, []);


  const getUserData = useCallback(async () => {
    if (state.contract) {
      try {

        const userAddress = state.accounts[0];
        const userData = await state.contract.methods.getUserByAddress(userAddress).call({ from: userAddress });


      } catch (err) {
        console.error(err);
      }
    }
  }, [state]);

  useEffect(() => {
    init();
  }, []);


  useEffect(() => {
    getUserData();
  }, [state.contract, getUserData]);

  useEffect(() => {
    if (
      state.jobApplicationManagement &&
      state.jobListings &&
      state.jobListingsManagement &&
      state.userManagement
    ) {

    }
  }, [
    state.jobApplicationManagement,
    state.jobListings,
    state.jobListingsManagement,
    state.userManagement,
  ]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
