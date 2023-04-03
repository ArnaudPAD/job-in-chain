
import AddDegree from "../Page/AddDegree";
import AddExperience from "../Page/AddExperience";
import AdminDashboard from "../Page/AdminDashboard";
import AllJobOffers from "../Page/AllJobOffers";
import EditProfil from "../Page/EditProfil";
import Employer from "../Page/Employer";
import Home from "../Page/Home";
import JobListings from "../Page/JobListings";
import Profile from "../Page/Profile";
import Signup from "../Page/Signup";
import Navbar from "../NavBar/NavBar";
import useEth from "../../contexts/EthContext/useEth";
import utils from "../Utils/utils";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function Navigation() {

    const [voter, setVoter] = useState();
    const [status, setStatus] = useState(0);
    const [owner, setOwner] = useState(0);
    const {
        state: { contract, accounts },
    } = useEth();
    function getOwner() {
        utils.getOwner(contract, accounts).then((result, err) => {
            if (err) {
                console.log(err);
            } else {
                setOwner(result);
            }
        });
    }
    useEffect(() => {
        // getVoter();

        getOwner();
    }, [accounts, status]);


    console.log("contract", owner)
    return (
        <Router>
            <Navbar owner={owner} accounts={accounts} />
            <div>
                <Routes>
                    <Route path="/" element={<Home owner={owner} accounts={accounts} />} />
                    <Route path="/profile" exact element={<Profile />} />
                    <Route path="/edit-profile" exact element={<EditProfil />} />
                    <Route path="/add-experience" exact element={<AddExperience />} />
                    <Route path="/add-degree" exact element={<AddDegree />} />
                    <Route path="/admin" exact element={<AdminDashboard />} />
                    <Route path="/signup" exact element={<Signup />} />
                    <Route path="/job-listings" exact element={<JobListings />} />
                    <Route path="/employer" exact element={<Employer />} />
                    <Route path="/all-job-offers" exact element={<AllJobOffers />} />
                    <Route render={() => <h1>404 Not Found</h1>} />
                </Routes >
            </div>


        </Router>
    );
};

export default Navigation
