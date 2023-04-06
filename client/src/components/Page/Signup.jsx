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
import useEth from "../../contexts/EthContext/useEth";
import { toast } from 'react-toastify';


const SignUp = () => {

    const {
        state: { contract, accounts },
    } = useEth();
    const [userType, setUserType] = useState("candidat");

    const handleChange = (event) => {
        setUserType(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userTypeEnum = userType === 'candidat' ? 0 : 1;
        const name = event.target.name.value;
        const email = event.target.email.value;
        const companyName = userType === 'entreprise' ? event.target.companyName.value : '';
        const kyc = ''; // TODO: Add KYC info
        const candidateInfo = ''; // TODO: Add candidate info
        try {
            const result = await contract.methods.createUser(userTypeEnum, name, email, companyName, kyc, candidateInfo).send({ from: accounts[0] });
            toast.success('Utilisateur créé avec succès !');
            console.log('User created with ID:', result);
            alert("Success");
        } catch (error) {
            toast.error('Erreur lors de la création de l\'utilisateur.');
            console.log('Error creating user:', error);
            alert("Error");

        }
    };

    return (
        <Box>
            <Text fontSize="2xl" mb={4}>
                Inscription
            </Text>
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>Type d'utilisateur</FormLabel>
                    <Select onChange={handleChange}>
                        <option value="candidat">Candidat</option>
                        <option value="entreprise">Entreprise</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Nom</FormLabel>
                    <Input name="name" type="text" />
                </FormControl>

                {userType === "entreprise" && (
                    <FormControl>
                        <FormLabel>Nom de l'entreprise</FormLabel>
                        <Input name="companyName" type="text" />
                    </FormControl>
                )}

                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" type="email" />
                </FormControl>



                <Button colorScheme="blue" size="lg" width="full" mt={4} type="submit">
                    S'inscrire
                </Button>
            </VStack>
        </Box>
    );
};

export default SignUp;
