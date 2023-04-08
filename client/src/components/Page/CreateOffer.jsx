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

import axios from "axios";


const CreateOffer = (props) => {

    const { user } = props

    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [salary, setSalary] = useState('');
    const [description, setDescription] = useState('');

    const {
        state: { jobApplicationManagement, jobListings, jobListingsManagement, userManagement, accounts, owner },
    } = useEth();
    async function createJobOffer(ipfsHash) {
        let userAcc = accounts ? accounts[0] : null;
        // Créez l'annonce sur la blockchain
        const createListingTransaction = await jobListings.methods.createListing(jobTitle, description, salary, ipfsHash).send({ from: userAcc });
        console.log("createListingTransaction", createListingTransaction);

        // Récupérez l'événement ListingCreated pour obtenir le listingId
        const listingCreatedEvent = createListingTransaction.events.ListingCreated;
        const listingId = listingCreatedEvent.returnValues.listingId;

        // Créez l'annonce NFT sur la blockchain en utilisant le listingId et récupérez le tokenID
        const tokenId = await jobListingsManagement.methods.createJobListingNFT(listingId).send({ from: userAcc });

        console.log(tokenId);
    }



    const handleSubmit = async (event) => {
        event.preventDefault();
        // Envoyer les métadonnées à Pinata
        try {

            var data = JSON.stringify({
                "pinataOptions": {
                    "cidVersion": 1
                },
                "pinataMetadata": {
                    "name": "jobInChainNFT",
                    "keyvalues": {
                        "customKey": "customValue",
                        "customKey2": "customValue2"
                    }
                },
                "pinataContent": {
                    "jobTitle": jobTitle,
                    "company": company,
                    "salary": salary,
                    "jobDescription": description
                }
            });

            var config = {
                method: 'post',
                url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3Yjc4NDE3NC0wNDg4LTQ0MzctODU1Yi0yNDdmZjNhMTQzYWQiLCJlbWFpbCI6ImFybmF1ZC5wdWF1ZHByb0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiN2YyZDNkNTVhN2VmOWY1ZjJmZjkiLCJzY29wZWRLZXlTZWNyZXQiOiIyMmE0MmMzNGMxNDkwZmMzN2RmYzVkNDI0MGU4OWY3ODk4ODg0OTQxMTVmNTlhMjZiZjcxYmFlZDhlMjFmNmY4IiwiaWF0IjoxNjgwODkwMDkzfQ.54h_bDOFKcjT0kVmqiew0ENK9T-_ELSatDi0BM5Sy8M'
                },
                data: data
            };

            const res = await axios(config);



            await createJobOffer(res.data.IpfsHash);

            // Envoyer les données vers votre API ou service backend ici
            console.log('Job Title: ', jobTitle);
            console.log('Company: ', company);
            console.log('Location: ', salary);
            console.log('Description: ', description);


            // Réinitialiser les entrées du formulaire après la soumission réussie
            setJobTitle('');
            setCompany('');
            setSalary('');
            setDescription('');

        } catch (error) {
            console.error('Error pinning metadata to IPFS:', error);
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
                <Text fontSize="2xl" mb={4}>Créer une annonce</Text>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4} alignItems="stretch">
                        <FormControl>
                            <FormLabel>Intitulé du poste</FormLabel>
                            <Input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Société</FormLabel>
                            <Input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Emplacement</FormLabel>
                            <Input
                                type="number"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                required
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
                            Créer l'annonce
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );

};

export default CreateOffer;