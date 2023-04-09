import React, { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    VStack,
    Flex
} from "@chakra-ui/react";
import useEth from "../../contexts/EthContext/useEth";
import { useNavigate, Link as Links } from "react-router-dom";

const AddDegree = () => {
    const [institution, setInstitution] = useState("");
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const {
        state: { jobApplicationManagement, jobListings, jobListingsManagement, userManagement, accounts, owner },
    } = useEth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await userManagement.methods.createDegree(institution, title, year).send({ from: accounts[0] });
            navigate("/profile");
            alert("Success");
            setInstitution("");
            setTitle("");
            setYear("");
        } catch (error) {
            console.log("error", error);
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
                p={4}
                shadow="md"
                borderWidth="1px"
                borderRadius="lg"
                bg="white"
                w="100%"
                maxW="600px"
            >
                <Text fontSize="2xl" mb={4}>Ajouter un diplôme</Text>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4} alignItems="stretch">
                        <FormControl>
                            <FormLabel>Institution</FormLabel>
                            <Input
                                type="text"
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Titre</FormLabel>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Année d'obtention</FormLabel>
                            <Input
                                type="number"
                                min="1900"
                                max="2099"
                                step="1"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            />
                        </FormControl>
                        <Button type="submit" colorScheme="blue">
                            Ajouter le diplôme
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Flex>

    );
};

export default AddDegree;