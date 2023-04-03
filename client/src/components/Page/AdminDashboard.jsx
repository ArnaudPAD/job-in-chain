import React, { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
} from "@chakra-ui/react";

const AdminDashboard = () => {
    const [diplomesEnAttente, setDiplomesEnAttente] = useState([
        {
            id: 1,
            nom: "Licence Informatique",
            date: "2022-09-01",
            userId: 123,
            userName: "Alice",
        },
        {
            id: 2,
            nom: "Master Génie Logiciel",
            date: "2021-09-01",
            userId: 124,
            userName: "Bob",
        },
    ]);
    const [experiencesEnAttente, setExperiencesEnAttente] = useState([
        {
            id: 1,
            nom: "Développeur Web",
            date: "2020-03-01",
            userId: 125,
            userName: "Charlie",
        },
        {
            id: 2,
            nom: "Ingénieur Logiciel",
            date: "2019-06-01",
            userId: 126,
            userName: "David",
        },
    ]);
    const [filtreDiplomes, setFiltreDiplomes] = useState("");
    const [filtreExperiences, setFiltreExperiences] = useState("");

    const diplomesFiltres = filtreDiplomes
        ? diplomesEnAttente.filter((diplome) =>
            diplome.nom.toLowerCase().includes(filtreDiplomes.toLowerCase())
        )
        : diplomesEnAttente;
    const experiencesFiltres = filtreExperiences
        ? experiencesEnAttente.filter((experience) =>
            experience.nom.toLowerCase().includes(filtreExperiences.toLowerCase())
        )
        : experiencesEnAttente;

    const approuverDiplome = (diplome) => {
        // code pour approuver le diplome ici
    };

    const rejeterDiplome = (diplome) => {
        // code pour rejeter le diplome ici
    };

    const approuverExperience = (experience) => {
        // code pour approuver l'experience ici
    };

    const rejeterExperience = (experience) => {
        // code pour rejeter l'experience ici
    };

    return (
        <Flex direction={["column", "column", "row"]} alignItems="center" gap={8}>
            <Box flex={1}>
                <Heading as="h2" mb={4} textAlign="center">
                    Diplômes en attente
                </Heading>
                <Input
                    placeholder="Filtrer par nom de diplôme"
                    value={filtreDiplomes}
                    onChange={(e) => setFiltreDiplomes(e.target.value)}
                    mb={4}
                />
                {diplomesFiltres.length > 0 ? (
                    <Stack spacing={4}>
                        {diplomesFiltres.map((diplome) => (
                            <Box
                                key={diplome.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={4}
                                shadow="md"
                            >
                                <Text mb={2}>{diplome.nom}</Text>
                                <Text mb={2}>{diplome.date}</Text>
                                <Text mb={2}>Utilisateur: {diplome.userName}</Text>
                                <Button onClick={() => approuverDiplome(diplome)}>
                                    Approuver
                                </Button>
                                <Button variant="ghost" onClick={() => rejeterDiplome(diplome)}>
                                    Rejeter
                                </Button>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Text>Aucun diplôme en attente</Text>
                )}
            </Box>
            <Box flex={1}>
                <Heading as="h2" mb={4} textAlign="center">
                    Expériences en attente
                </Heading>
                <Input
                    placeholder="Filtrer par nom d'expérience"
                    value={filtreExperiences}
                    onChange={(e) => setFiltreExperiences(e.target.value)}
                    mb={4}
                />
                {experiencesFiltres.length > 0 ? (
                    <Stack spacing={4}>
                        {experiencesFiltres.map((experience) => (
                            <Box
                                key={experience.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={4}
                                shadow="md"
                            >
                                <Text mb={2}>{experience.nom}</Text>
                                <Text mb={2}>{experience.date}</Text>
                                <Text mb={2}>Utilisateur: {experience.userName}</Text>
                                <Button onClick={() => approuverExperience(experience)}>
                                    Approuver
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => rejeterExperience(experience)}
                                >
                                    Rejeter
                                </Button>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Text>Aucune expérience en attente</Text>
                )}
            </Box>
        </Flex>
    );
};

export default AdminDashboard;
