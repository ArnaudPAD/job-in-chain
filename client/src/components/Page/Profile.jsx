import React, { useState } from 'react';
import { FaEdit, FaTimes } from "react-icons/fa";
import { Box, VStack, Heading, Text, HStack, StackDivider, Badge, Container, Divider, IconButton } from '@chakra-ui/react';

const PersonalInfo = ({ name, email, phone }) => (
    <VStack align="start" spacing={2}>
        <Heading size="md">Informations personnelles</Heading>
        <Text>Nom: {name}</Text>
        <Text>Email: {email}</Text>
        <Text>Téléphone: {phone}</Text>
    </VStack>
);

const Experience = ({ experiences, onDelete }) => (
    <VStack align="start" spacing={2}>
        <Heading size="md" textAlign="center">
            Expériences professionnelles
        </Heading>
        {experiences.map((exp) => (
            <Box key={exp.id}>

                <Text fontWeight="bold">{exp.position}</Text>
                <HStack justifyContent="space-between" w="100%">
                    <Text>{exp.companyName}</Text>
                    <HStack>
                        <Text>({exp.beginDate} - {exp.endDate || 'En cours'})</Text>
                        {exp.isVerified && <Badge colorScheme="green">Vérifié</Badge>}
                        {!exp.isVerified && <Badge colorScheme="red">Pas vérifié</Badge>}
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

const Diplomas = ({ diplomas, onDelete }) => (
    <VStack align="start" spacing={2}>
        <Heading size="md" textAlign="center">Diplômes</Heading>
        {diplomas.map((diploma) => (
            <Box key={diploma.id}>
                <HStack justifyContent="space-between" w="100%">
                    <Text fontWeight="bold">{diploma.title}</Text>
                    <HStack>
                        <Text>{diploma.year}</Text>
                        {diploma.isVerified && <Badge colorScheme="green">Vérifié</Badge>}
                        {!diploma.isVerified && <Badge colorScheme="red">Pas vérifié</Badge>}
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
);

const Profile = () => {
    const [personalInfo, setPersonalInfo] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
    });

    const [experiences, setExperiences] = useState([
        {
            id: 1,
            companyName: "Google",
            position: "Software Engineer",
            beginDate: "2018-05-01",
            endDate: "2020-08-15",
            description: "Développement d'applications Web et mobiles",
            isVerified: true,
        },
        {
            id: 1,
            companyName: "Google",
            position: "Software Engineer",
            beginDate: "2018-05-01",
            endDate: "2020-08-15",
            description: "Développement d'applications Web et mobiles",
            isVerified: false,
        },
        {
            id: 1,
            companyName: "Google",
            position: "Software Engineer",
            beginDate: "2018-05-01",
            endDate: "2020-08-15",
            description: "Développement d'applications Web et mobiles",
            isVerified: true,
        },
        {
            id: 1,
            companyName: "Google",
            position: "Software Engineer",
            beginDate: "2018-05-01",
            endDate: "2020-08-15",
            description: "Développement d'applications Web et mobiles",
            isVerified: false,
        },
        // ...
        // Ajoutez d'autres expériences ici
        // ...
    ]);

    const [diplomas, setDiplomas] = useState([
        {
            id: 1,
            institution: "Université de Paris",
            title: "Master en Informatique",
            year: "2017",
            isVerified: true,
        },
        {
            id: 1,
            institution: "Université de Paris",
            title: "Master en Informatique",
            year: "2017",
            isVerified: false,
        },
        {
            id: 1,
            institution: "Université de Paris",
            title: "Master en Informatique",
            year: "2017",
            isVerified: true,
        },
        {
            id: 1,
            institution: "Université de Paris",
            title: "Master en Informatique",
            year: "2017",
            isVerified: false,
        },
        {
            id: 1,
            institution: "Université de Paris",
            title: "Master en Informatique",
            year: "2017",
            isVerified: true,
        },
        // ...
        // Ajoutez d'autres diplômes ici
        // ...
    ]);

    return (
        <Container maxW="container.lg">
            <VStack spacing={8} divider={<StackDivider borderColor="gray.200" />} align="stretch">
                <Box boxShadow="base" p={5} borderRadius="md" bg="white">
                    <PersonalInfo {...personalInfo} />
                </Box>
                <Box boxShadow="base" p={5} borderRadius="md" bg="white">
                    <Experience experiences={experiences} />
                </Box>
                <Box boxShadow="base" p={5} borderRadius="md" bg="white">
                    <Diplomas diplomas={diplomas} />
                </Box>
            </VStack>
        </Container>
    );
};


export default Profile;