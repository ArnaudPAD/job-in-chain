import React, { useState } from "react";
import {
    Box,
    Text,
    VStack,
    Input,
    FormControl,
    FormLabel,
    Select,
    Button,
} from "@chakra-ui/react";

const SignUp = () => {
    const [userType, setUserType] = useState("candidat");

    const handleChange = (event) => {
        setUserType(event.target.value);
    };

    return (
        <Box>
            <Text fontSize="2xl" mb={4}>
                Inscription
            </Text>
            <VStack spacing={4}>
                <FormControl>
                    <FormLabel>Type d'utilisateur</FormLabel>
                    <Select onChange={handleChange}>
                        <option value="candidat">Candidat</option>
                        <option value="entreprise">Entreprise</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Nom</FormLabel>
                    <Input type="text" />
                </FormControl>

                {userType === "entreprise" && (
                    <FormControl>
                        <FormLabel>Nom de l'entreprise</FormLabel>
                        <Input type="text" />
                    </FormControl>
                )}

                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" />
                </FormControl>

                <FormControl>
                    <FormLabel>Mot de passe</FormLabel>
                    <Input type="password" />
                </FormControl>

                <Button colorScheme="blue" size="lg" width="full" mt={4}>
                    S'inscrire
                </Button>
            </VStack>
        </Box>
    );
};

export default SignUp;
