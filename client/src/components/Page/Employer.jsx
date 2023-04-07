import React from "react";
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
} from "@chakra-ui/react";

import { ViewIcon, CheckIcon, CloseIcon, EmailIcon } from "@chakra-ui/icons";

const JobOffer = ({ offer, onClick }) => (
    <Tr onClick={onClick}>
        <Td>{offer.title}</Td>
        <Td>{offer.description}</Td>
        <Td isNumeric>{offer.annualSalary} €</Td>
        <Td isNumeric>{offer.tokenBounty} tokens</Td>
    </Tr>
);

const Applicant = ({ applicant, onAccept, onReject }) => (
    <Tr>
        <Td>{applicant.name}</Td>
        <Td>{applicant.email}</Td>
        <Td>{applicant.degree}</Td>
        <Td>{applicant.experience}</Td>
        <Td>
            <HStack>
                <IconButton
                    aria-label="Accepter"
                    icon={<CheckIcon />}
                    colorScheme="green"
                    onClick={onAccept}
                    mr={2}
                />
                <IconButton
                    aria-label="Accepter"
                    icon={<EmailIcon />}
                    colorScheme="blue"
                    onClick={() => { alert("Le mail de proposition a bien été envoyé à " + applicant.email) }}
                    mr={2}
                />
                <IconButton
                    aria-label="Refuser"
                    icon={<CloseIcon />}
                    colorScheme="red"
                    onClick={onReject}
                />
            </HStack>
        </Td>
    </Tr>
);

const EmployerDashboard = () => {
    const [selectedOfferIndex, setSelectedOfferIndex] = React.useState(null);

    const jobOffers = [
        {
            title: "Développeur Web",
            description: "Développement Web full-stack",
            annualSalary: 50000,
            tokenBounty: 1000,
            applicants: [
                {
                    name: "Alice",
                    email: "alice@example.com",
                    degree: "Master en informatique",
                    experience: "3 ans",
                },
                {
                    name: "Bob",
                    email: "bob@example.com",
                    degree: "Licence en informatique",
                    experience: "2 ans",
                },
            ],
        },
        {
            title: "Data Analyst",
            description: "Analyse de données",
            annualSalary: 55000,
            tokenBounty: 1200,
            applicants: [
                {
                    name: "Charlie",
                    email: "charlie@example.com",
                    degree: "Master en statistiques",
                    experience: "4 ans",
                },
            ],
        },
        {
            title: "UX/UI Designer",
            description: "Conception d'interfaces utilisateur",
            annualSalary: 45000,
            tokenBounty: 800,
            applicants: [],
        },
        {
            title: "Ingénieur en cybersécurité",
            description: "Protection des systèmes informatiques",
            annualSalary: 60000,
            tokenBounty: 1500,
            applicants: [],
        },
        {
            title: "Chef de projet",
            description: "Gestion de projets informatiques",
            annualSalary: 65000,
            tokenBounty: 1800,
            applicants: [],
        },
    ];

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
                                <Th isNumeric>Bounty</Th>
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
                        <Button colorScheme="blue">
                            Créer une offre
                        </Button>
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
                                            onAccept={() =>
                                                handleAccept(selectedOfferIndex, index)
                                            }
                                            onReject={() =>
                                                handleReject(selectedOfferIndex, index)
                                            }
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
