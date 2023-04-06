import React, { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Textarea,
    VStack,
    Flex
} from "@chakra-ui/react";
import useEth from "../../contexts/EthContext/useEth";

const AddExperience = () => {
    const [companyName, setCompanyName] = useState("");
    const [position, setPosition] = useState("");
    const [beginDate, setBeginDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const {
        state: { contract, accounts },
    } = useEth();
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const result = await contract.methods.createExperience(companyName, position, beginDate, endDate, description).send({ from: accounts[0] });
            console.log('Degree added with ID:', result);
            alert("Success");
            // Réinitialisez le formulaire
            setCompanyName("");
            setPosition("");
            setBeginDate("");
            setEndDate("");
            setDescription("");
        } catch (error) {
            console.log('Error adding degree:', error);
            alert("Error");
        }
    };
    return (
        <Flex
            minHeight="100vh"
            justifyContent="center"
            alignItems="center"
            p={4}
            bg="gray.50"
        >
            <Box
                p={6}
                shadow="md"
                borderWidth="1px"
                borderRadius="lg"
                bg="white"
                w="100%"
                maxW="600px"
            >
                <Text fontSize="2xl" mb={4}>Ajouter une expérience</Text>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4} alignItems="stretch">
                        <FormControl>
                            <FormLabel>Nom de l'entreprise</FormLabel>
                            <Input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Poste</FormLabel>
                            <Input
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Date de début</FormLabel>
                            <Input
                                type="date"
                                value={beginDate}
                                onChange={(e) => setBeginDate(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Date de fin</FormLabel>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </FormControl>
                        <Button type="submit" colorScheme="blue">
                            Ajouter l'expérience
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
};

export default AddExperience;