import React, { useEffect, useState } from "react";
import {
    Box,
    Text,
    Flex,
    Spacer,
    VStack,
    HStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import useEth from "../../contexts/EthContext/useEth";


import { ViewIcon, CheckIcon, CloseIcon, EmailIcon } from "@chakra-ui/icons";


const JobOffer = ({ offer, onClick }) => {

    return (<Tr onClick={onClick}>
        <Td>{offer.title}</Td>
        <Td>{offer.description}</Td>
        <Td isNumeric>{offer.salary} € / ans</Td>
        <Td> <button onClick={() => window.open('https://gateway.pinata.cloud/ipfs/' + offer.ipfsHash, '_blank')}>Lien NFT</button></Td>

    </Tr>)
};

const Applicant = ({ key, applicant, userManagement, account, jobApplicationManagement }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [info, setInfo] = useState("");
    const [expe, setExpe] = useState([]);
    const [dipl, setDipl] = useState([]);
    const handleApplicantInfoClick = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };
    async function infoApplicant() {

        let info = await userManagement.methods.getUserById(applicant.candidateId).call({ from: account });

        setInfo(info);
        const degrees = await userManagement?.methods?.getUserDegrees(applicant.candidateId).call();
        const experiences = await userManagement?.methods?.getUserExperiences(applicant.candidateId).call();

        console.log("degres", degrees);
        console.log("experiences", experiences);

        const filteredDegrees = degrees.filter(
            (degree) => degree.status === "Valide"
        );
        const filteredExperiences = experiences.filter(
            (experience) => experience.status === "Valide"
        );
        console.log("fiiiii", filteredDegrees);
        console.log("feeeeeee", filteredExperiences);



        setExpe(filteredExperiences);
        setDipl(filteredDegrees)
    }

    async function hireCandidat() {
        console.log("ici", applicant);
        console.log("la", info);
        let hire = await jobApplicationManagement.methods.hireCandidate(applicant.jobListingId, applicant.applicationId, info.walletAddress).send({ from: account })
        console.log("hire", hire);
    }

    async function rejectCandidat() {
        console.log("ici", applicant);
        console.log("la", info);
        let hire = await jobApplicationManagement.methods.rejectCandidate(applicant.jobListingId, applicant.applicationId).send({ from: account })
        console.log("hire", hire);
    }


    useEffect(() => {
        infoApplicant()
    }, [account])

    useEffect(() => {
        console.log("fiiiiiState", dipl);
        console.log("feeeeeeeState", expe);
    }, [dipl, expe])

    return (
        <>
            <Tr key={key}>
                <Td>{info?.name}</Td>
                <Td>{info?.email}</Td>
                <Td>{applicant.message}</Td>
                <Td>{dipl?.length} </Td>
                <Td>{expe?.length}</Td>

                <Td>
                    <HStack>
                        <IconButton
                            aria-label="Plus d'informations"
                            icon={<ViewIcon />}
                            colorScheme="blue"
                            onClick={() => handleApplicantInfoClick(key)}
                        />
                        <IconButton
                            aria-label="Accepter"
                            icon={<CheckIcon />}
                            colorScheme="green"
                            onClick={hireCandidat}
                            mr={2}
                        />
                        <IconButton
                            aria-label="Contacter"
                            icon={<EmailIcon />}
                            colorScheme="blue"
                            onClick={() => { alert("Le mail de proposition a bien été envoyé à " + applicant.email) }}
                            mr={2}
                        />
                        <IconButton
                            aria-label="Refuser"
                            icon={<CloseIcon />}
                            onClick={rejectCandidat}
                            colorScheme="red"

                        />
                    </HStack>
                </Td>

            </Tr>
            {expandedIndex === key && (
                <Tr>
                    <Td colSpan="6">
                        <Text fontWeight="bold" mb={2}>
                            Diplômes:
                        </Text>
                        {dipl.map((degree, index) => (
                            <Text key={index}>
                                {degree.institution + " / " + degree.title} - {degree.year}
                            </Text>
                        ))}
                        <Text fontWeight="bold" mt={4} mb={2}>
                            Expériences:
                        </Text>
                        {expe.map((experience, index) => (
                            <Text key={index}>
                                {experience.position} - {experience.companyName} - {experience.endDate}
                            </Text>
                        ))}
                    </Td>
                </Tr>
            )}



        </>

    )

};

const EmployerDashboard = () => {
    const [selectedOfferIndex, setSelectedOfferIndex] = React.useState(null);
    const {
        state: { jobApplicationManagement, jobListings, jobListingsManagement, userManagement, accounts, owner },
    } = useEth();

    const [jobOffers, setJobOffers] = useState([]);



    const account = accounts ? accounts[0] : null

    const handleOfferClick = (index) => {
        setSelectedOfferIndex(index);
    };

    const handleCloseApplicants = () => {
        setSelectedOfferIndex(null);
    };

    const handleAccept = (offerIndex, applicantIndex) => {
        jobOffers[offerIndex].applicants.splice(applicantIndex, 1);
    };

    const handleReject = (offerIndex, applicantIndex) => {
        jobOffers[offerIndex].applicants.splice(applicantIndex, 1);
    };

    const getAllEmployerOffer = async () => {
        const offers = await jobListings.methods.getListingsByCompany(account).call({ from: account });

        offers.forEach(async (el, index) => {
            let offer = await jobListings.methods.getListing(el).call({ from: account });


            let applicant = await jobApplicationManagement.methods.getJobApplications(el).call({ from: account });


            // let applicantInfo = await userManagement.methods.getUserById(applicant.candidateId).call({ from: account });




            // Créer un objet 'jobOffer' avec les informations d'offre d'emploi et les candidats associés
            let jobOffer = {
                title: offer.title,
                description: offer.description,
                salary: offer.salary,
                company: offer.company,
                ipfsHash: offer.ipfsHash,
                applicants: applicant
            };


            setJobOffers(prevOffers => [...prevOffers, jobOffer]);
        })

    };

    useEffect(() => {
        getAllEmployerOffer()
    }, [accounts])
    console.log("offers", jobOffers);
    return (
        <Box>
            <Text fontSize="2xl" mb={4}>
                Tableau de bord de l'employeur
            </Text>
            <Flex>
                <Box w="50%">
                    <Text fontSize="xl">Mes offres</Text>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr>
                                <Th>Titre</Th>
                                <Th>Description</Th>
                                <Th isNumeric>Sal. annuel</Th>

                            </Tr>
                        </Thead>
                        <Tbody>
                            {jobOffers.map((offer, index) => (
                                <JobOffer
                                    key={index}
                                    offer={offer}
                                    onClick={() => handleOfferClick(index)}
                                />
                            ))}
                        </Tbody>
                    </Table>
                    <Flex justifyContent="center" alignItems="center">

                    </Flex>

                </Box>
                <Spacer />
                {selectedOfferIndex !== null && (
                    <Box w="50%">
                        <Text fontSize="xl" mb={4}>
                            Candidats pour l'offre{" "}
                            {jobOffers[selectedOfferIndex].title}
                        </Text>
                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr>
                                    <Th>Nom</Th>
                                    <Th>Email</Th>
                                    <Th>Message</Th>
                                    <Th>Diplôme</Th>
                                    <Th>Expérience</Th>
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {jobOffers[selectedOfferIndex].applicants.map(
                                    (applicant, index) => (
                                        <Applicant
                                            key={index}
                                            applicant={applicant}
                                            jobApplicationManagement={jobApplicationManagement}
                                            userManagement={userManagement}
                                            account={account}
                                        />
                                    )
                                )}
                            </Tbody>
                        </Table>
                        <Button colorScheme="blue" mt={4} onClick={handleCloseApplicants}>
                            Retour aux offres
                        </Button>
                    </Box>
                )}
            </Flex>

        </Box>
    );
};

export default EmployerDashboard;
