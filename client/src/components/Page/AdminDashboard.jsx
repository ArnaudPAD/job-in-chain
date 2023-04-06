import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react";
import useEth from "../../contexts/EthContext/useEth";
import utils from '../Utils/utils';

const AdminDashboard = () => {
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [selectedDiplome, setSelectedDiplome] = useState(null)
    const [filtreDiplomes, setFiltreDiplomes] = useState("");
    const [filtreExperiences, setFiltreExperiences] = useState("");
    const [pendingDiplome, setPendingDiplome] = useState([]);
    const [pendingExperience, setPendingExperience] = useState([""]);
    const {
        state: { contract, accounts, owner },
    } = useEth();

    const fetchPendingData = async () => {
        try {
            const pendingDegrees = await contract.methods.getAllPendingDegrees().call({ from: accounts[0] });
            const pendingExperiences = await contract.methods.getAllPendingExperiences().call({ from: accounts[0] });
            console.log("PD", pendingDegrees);
            setPendingDiplome(pendingDegrees);
            setPendingExperience(pendingExperiences);
        } catch (error) {
            console.error("Erreur lors de la récupération des données en attente :", error);
        }
    };


    useEffect(() => {
        fetchPendingData()
    }, [accounts]);

    const approuverDiplome = async (diplome) => {
        let numberDip = BigInt(diplome.id);
        try {
            let result = await contract.methods.verifyDegree(numberDip).send({ from: accounts[0] });
            console.log("r", result);
            fetchPendingData();
        } catch (error) {
            console.error("Erreur lors de l'approbation du diplôme :", error);
        }
    };

    const rejeterDiplome = async (diplome) => {
        try {
            await contract.methods.rejectDegree(diplome.id).send({ from: accounts[0] });
            fetchPendingData();
        } catch (error) {
            console.error("Erreur lors du rejet du diplôme :", error);
        }
    };

    const approuverExperience = async (experience) => {
        console.log("experience", experience);
        try {

            if (await contract.methods.verifyExperience(experience.id).call({ from: accounts[0] })) {

                await contract.methods.verifyExperience(experience.id).send({ from: accounts[0] });
                fetchPendingData();
            } else {

                console.log("fetch", fetch);
            }


        } catch (error) {
            console.error("Erreur lors de l'approbation de l'expérience :", error);
        }
    };

    const rejeterExperience = async (experience) => {
        try {
            await contract.methods.rejectExperience(experience.id).send({ from: accounts[0] });
            fetchPendingData();
        } catch (error) {
            console.error("Erreur lors du rejet de l'expérience :", error);
        }
    };

    return (
        <Flex direction={["column", "column", "row"]} alignItems="center" gap={8}>
            <Box flex={1}>
                <Heading as="h2" mb={4} textAlign="center">
                    Diplômes en attente
                </Heading>

                {pendingDiplome?.length > 0 ? (
                    <Stack spacing={4}>
                        {pendingDiplome?.map((diplome) => {


                            return (
                                <Box
                                    key={diplome?.id}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    p={4}
                                    shadow="md"
                                >
                                    <Text mb={2}> Institution: {diplome?.institution}</Text>
                                    <Text mb={2}> Titre: {diplome?.title}</Text>
                                    <Text mb={2}>Année d'obtention {diplome?.year}</Text>



                                    <Button onClick={async () => {
                                        let user = await contract.methods.getUserById(diplome?.userId).call({ from: accounts[0] });
                                        console.log("user", user);
                                        setSelectedDiplome(user)
                                    }}>
                                        Voir l'utilisateur
                                    </Button>
                                    <Button onClick={() => approuverDiplome(diplome)}>
                                        Approuver
                                    </Button>
                                    <Button variant="ghost" onClick={() => rejeterDiplome(diplome)}>
                                        Rejeter
                                    </Button>
                                </Box>)
                        }




                        )}
                    </Stack>
                ) : (
                    <Text>Aucun diplôme en attente</Text>
                )}
            </Box>
            <Box flex={1}>
                <Heading as="h2" mb={4} textAlign="center">
                    Expériences en attente
                </Heading>

                {pendingExperience?.length > 0 ? (
                    <Stack spacing={4}>
                        {pendingExperience.map((experience) => {



                            return (<Box
                                key={experience.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={4}
                                shadow="md"
                            >
                                <Text mb={2}>Nom de l'entreprise:{experience[2]}</Text>
                                <Text mb={2}>Nom du poste {experience[3]}</Text>
                                <Text mb={2}>Utilisateur: {"experience.userName"}</Text>
                                <Text mb={2}>Date de début {experience[4]}</Text>
                                <Text mb={2}>Date de fin {experience[5]}</Text>
                                <Button onClick={async () => {
                                    let user = await contract.methods.getUserById(experience?.userId).call({ from: accounts[0] });
                                    console.log("user", user);
                                    setSelectedExperience(user)

                                }}>Voir l'utilisateur</Button>

                                <Button onClick={() => approuverExperience(experience)}>
                                    Approuver
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => rejeterExperience(experience)}
                                >
                                    Rejeter
                                </Button>
                            </Box>)

                        }


                        )}
                        {selectedExperience && (
                            <Modal isOpen onClose={() => setSelectedExperience(null)}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Informations utilisateur</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <Text mb={2}>Nom d'utilisateur: {selectedExperience.name}</Text>
                                        <Text mb={2}>Email: {selectedExperience.email}</Text>

                                        {/* ajoutez toutes les autres informations de l'utilisateur ici */}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="ghost" onClick={() => setSelectedExperience(null)}>
                                            Fermer
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        )}

                        {selectedDiplome && (
                            <Modal isOpen onClose={() => setSelectedDiplome(null)}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Informations utilisateur</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <Text mb={2}>Nom d'utilisateur: {selectedDiplome.name}</Text>
                                        <Text mb={2}>Email: {selectedDiplome.email}</Text>

                                        {/* ajoutez toutes les autres informations de l'utilisateur ici */}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="ghost" onClick={() => setSelectedDiplome(null)}>
                                            Fermer
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        )}
                    </Stack>


                ) : (
                    <Text>Aucune expérience en attente</Text>
                )}
            </Box>
        </Flex>
    );
};

export default AdminDashboard;
