import React, { useState } from 'react';
import { FaEdit, FaTimes } from "react-icons/fa";
import { Box, Text, Button, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import utils from '../Utils/utils';

const JobListings = () => {

    const [jobs, setJobs] = useState(utils.createFakeJobOffers())
    const [selectedJob, setSelectedJob] = useState(null);


    const onApply = () => {
        alert("J'ai applié")
    }
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
                    <Button mt={2} onClick={() => handleViewMoreClick(job)}>
                        Voir plus
                    </Button>
                    {job.canApply && (
                        <Button mt={2} colorScheme="blue" onClick={() => handleApplyClick(job)}>
                            Postuler
                        </Button>
                    )}
                </Box>
            ))}


            {selectedJob && (
                <Modal isOpen={selectedJob !== null} onClose={closeModal}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{selectedJob.title}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>{selectedJob.details}</Text>
                        </ModalBody>
                        <ModalFooter>
                            {selectedJob.canApply && <Button colorScheme="blue" mr={3} onClick={() => handleApplyClick(selectedJob)}>Postuler</Button>}
                            <Button onClick={closeModal}>Fermer</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </VStack>
    );

};

export default JobListings;
