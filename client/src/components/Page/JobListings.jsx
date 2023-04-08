import React, { useState, useEffect } from 'react';
import { Box, Text, Button, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import useEth from "../../contexts/EthContext/useEth";
const JobListings = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const {
        state: { jobApplicationManagement, jobListings, jobListingsManagement, userManagement, accounts, owner },
    } = useEth();
    const userAccount = accounts ? accounts[0] : null




    const fetchJobs = async () => {

        const numJobs = await jobListings.methods.getListingCount().call({ from: accounts[0] });
        const jobList = [];

        for (let i = 1; i <= numJobs; i++) {
            const job = await jobListings.methods.getListing(i).call({ from: accounts[0] });
            jobList.push(job);
        }

        setJobs(jobList);
    };


    useEffect(() => {
        fetchJobs();
    }, [accounts]);

    const onApply = async (job) => {

        let user = await userManagement.methods.getUserByAddress(userAccount).call({ from: userAccount });

        let apply = await jobApplicationManagement.methods.applyForJob(job.tokenId, "Bonjour je souhaite intégrer votre équipe", user.id,).send({ from: userAccount });

    };

    const handleApplyClick = (job) => {
        onApply(job);
    };

    const handleViewMoreClick = (job) => {
        setSelectedJob(job);
    };

    const closeModal = () => {
        setSelectedJob(null);
    };

    return (
        <VStack spacing={4}>
            {jobs.map((job, index) => (
                <Box key={index} width="100%" p={5} shadow="md" borderWidth="1px" mb={4} maxW="calc(100% - 10cm)">
                    <Text fontWeight="bold">{job.title}</Text>
                    <Text>{job.description}</Text>
                    <Text>{job.salary} €/ an</Text>
                    <Button mt={2} onClick={() => handleViewMoreClick(job)}>
                        Voir plus
                    </Button>
                    <Button mt={2} colorScheme="blue" onClick={() => handleApplyClick(job)}>
                        Postuler
                    </Button>
                </Box>
            ))}

            {selectedJob && (
                <Modal isOpen={selectedJob !== null} onClose={closeModal}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{selectedJob.title}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>{selectedJob.description}</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={() => handleApplyClick(selectedJob)}>Postuler</Button>
                            <Button onClick={closeModal}>Fermer</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </VStack>
    );
};

export default JobListings;
