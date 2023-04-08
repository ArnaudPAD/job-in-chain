import React, { useEffect, useState } from 'react';
import { FaEdit, FaTimes } from "react-icons/fa";
import { Box, VStack, Heading, Text, HStack, StackDivider, Badge, Container, Divider, IconButton } from '@chakra-ui/react';
import useEth from "../../contexts/EthContext/useEth";
import utils from '../Utils/utils';


const PersonalInfo = ({ name, email, userType }) => (
    <VStack align="start" spacing={2}>
        <Heading size="md">Informations personnelles</Heading>
        <Text>Nom: {name}</Text>
        <Text>Email: {email}</Text>
        <Text>Status: {userType == 0 ? "Candidat" : "Employeur"}</Text>
    </VStack>
);

const Experience = ({ experiences, onDelete }) => (
    <VStack align="start" spacing={2}>
        <Heading size="md" textAlign="center">
            Expériences professionnelles
        </Heading>
        {experiences.map((exp, key) => (
            <Box key={key}>

                <Text fontWeight="bold">{exp.position}</Text>
                <HStack justifyContent="space-between" w="100%">
                    <Text>{exp.companyName}</Text>
                    <HStack>
                        <Text>({exp.beginDate} - {exp.endDate || 'En cours'})</Text>
                        {exp.status == "Valide" && <Badge colorScheme="green">Vérifié</Badge>}
                        {exp.status == "Pending" && <Badge colorScheme="orange">En attente</Badge>}
                        <IconButton
                            icon={<FaTimes />}
                            aria-label="Supprimer cette expérience"
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(exp.id)}
                        />
                    </HStack>
                </HStack>
                <Text>{exp.description}</Text>
                <Divider my={2} />
            </Box>
        ))}</VStack>
);

const Diplomas = ({ diplomas, onDelete }) => {
   
    return (
        <VStack align="start" spacing={2}>
            <Heading size="md" textAlign="center">Diplômes</Heading>
            {diplomas?.map((diploma, key) => (
                <Box key={key}>
                    <HStack justifyContent="space-between" w="100%">
                        <Text fontWeight="bold">{diploma.title}</Text>
                        <HStack>
                            <Text>{diploma.year}</Text>
                            {diploma.status == "Valide" && <Badge colorScheme="green">Vérifié</Badge>}
                            {diploma.status == "Pending" && <Badge colorScheme="orange">En Attente</Badge>}
                            <IconButton
                                icon={<FaTimes />}
                                aria-label="Supprimer ce diplôme"
                                size="sm"
                                variant="ghost"
                                onClick={() => onDelete(diploma.id)}
                            />
                        </HStack>
                    </HStack>
                    <Text>{diploma.institution}</Text>
                    <Divider my={2} />
                </Box>
            ))}
        </VStack>
    )

}




const Profile = () => {
    const [user, setUser] = useState("");
    const [eventData, setEventData] = useState(null);

    const [userDegrees, setUserDegrees] = useState([]);
    const [userExperiences, setUserExperiences] = useState([]);

    const {
        state: { jobApplicationManagement, jobListings, jobListingsManagement, userManagement, accounts, owner },
    } = useEth();
  

    async function getUser() {
        const getUser = await utils.getUserByAdress(userManagement, accounts)
        setPersonalInfo(getUser)
    };

    async function getUserData() {



        const getUser = await utils.getUserByAdress(userManagement, accounts);


        const degrees = await userManagement?.methods?.getUserDegrees(getUser.id).call();
        const experiences = await userManagement?.methods?.getUserExperiences(getUser.id).call();

    

        const filteredDegrees = degrees.filter(
            (degree) => degree.status === "Valide" || degree.status === "Pending"
        );
        const filteredExperiences = experiences.filter(
            (experience) => experience.status === "Valide" || experience.status === "Pending"
        );

        setUserDegrees(filteredDegrees);
        setUserExperiences(filteredExperiences);
    }






    useEffect(() => {

        getUser();
        getUserData()
    }, [accounts, jobApplicationManagement, jobListings, jobListingsManagement, userManagement,]);





    const [personalInfo, setPersonalInfo] = useState({});





    return (
        <Container maxW="container.lg">
            <VStack spacing={8} divider={<StackDivider borderColor="gray.200" />} align="stretch">
                <Box boxShadow="base" p={5} borderRadius="md" bg="white">
                    <PersonalInfo {...personalInfo} />
                </Box>
                <Box boxShadow="base" p={5} borderRadius="md" bg="white">
                    <Experience experiences={userExperiences} />
                </Box>
                <Box boxShadow="base" p={5} borderRadius="md" bg="white">
                    <Diplomas diplomas={userDegrees} />
                </Box>
            </VStack>
        </Container>
    );
};


export default Profile;