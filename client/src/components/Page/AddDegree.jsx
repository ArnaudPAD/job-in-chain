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

const AddDegree = () => {
    const [institution, setInstitution] = useState("");
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Traitez les données du formulaire ici
        // Vous pouvez par exemple envoyer les données à une API ou les stocker dans un état global

        // Réinitialisez le formulaire
        setInstitution("");
        setTitle("");
        setYear("");
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