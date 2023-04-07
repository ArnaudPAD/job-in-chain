import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.jpg"
import utils from "../Utils/utils"
import { useNavigate, Link } from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";
import { Container, Box, Heading, Text, Stack, Button, Image } from "@chakra-ui/react";
function Home(props) {
    const navigate = useNavigate();

    const {
        state: { jobApplicationManagement, jobListings, jobListingsManagement, userManagement, accounts },
    } = useEth();
    const [userType, setUserType] = useState("");
    const [user, setUser] = useState("");

    async function checkIfSubscribe() {
        const user = await utils.getUserByAdress(userManagement, accounts);


        if (user?.email == '') {

        } else {

            console.log(user?.userType);
            if (user?.userType == "0") {
                setUserType("Candidate")
            } else if (user?.userType == "1") {
                setUserType("Recruiter")
            } else {
                setUserType(null)
            }

            setUser(user)

        }
    }

    useEffect(() => {
        checkIfSubscribe()

    }, [accounts,]);

    console.log("contractdsqdsqdsq", userManagement);



    return (
        <>

            <Container maxW="container.lg">
                <Box textAlign="center" my={8}>
                    <Image src={logo} alt="Job In Chain" />

                    <Text fontSize="lg" mt={4}>
                        Le nouveau réseau pour l'emploi du web 3.0
                    </Text>
                    <Text fontSize="lg" mt={4}>
                        Job In Chain est un réseau social pour les professionnels de l'informatique qui cherchent à connecter avec les entreprises les plus innovantes. Nous avons créé une plateforme qui permet aux candidats de trouver des emplois adaptés à leurs compétences, de se connecter avec des recruteurs et de trouver des mentors.
                    </Text>
                    <Stack direction="row" spacing={4} mt={8} justify="center">

                        {!user?.email ? <Link to="/signup"><Button colorScheme="green" size="lg">Créer un profil</Button></Link> : <Link to="/profile"><Button colorScheme="green" size="lg">Votre profil</Button></Link>}

                        <Button colorScheme="gray" size="lg">En savoir plus</Button>
                    </Stack>
                </Box>
                <Box my={8}>
                    <Heading size="lg" mb={4}>Roadmap</Heading>
                    <Box p={4} bg="gray.100" borderRadius="md">
                        <Heading size="md" mb={2}>Q1 2023</Heading>
                        <Text fontSize="lg">Lancement de la plateforme Job In Chain avec des fonctionnalités de base telles que la recherche d'emplois, la création de profil, la messagerie, etc.</Text>
                    </Box>
                    <Box p={4} bg="gray.100" borderRadius="md" mt={4}>
                        <Heading size="md" mb={2}>Q2 2023</Heading>
                        <Text fontSize="lg">Ajout de fonctionnalités avancées telles que les recommandations personnalisées, la correspondance de compétences, les évaluations, etc.</Text>
                    </Box>
                    <Box p={4} bg="gray.100" borderRadius="md" mt={4}>
                        <Heading size="md" mb={2}>Q3 2023</Heading>
                        <Text fontSize="lg">Expansion de la plateforme Job In Chain sur les marchés internationaux clés.</Text>
                    </Box>
                </Box>
            </Container>

        </>
    );
};

export default Home;
