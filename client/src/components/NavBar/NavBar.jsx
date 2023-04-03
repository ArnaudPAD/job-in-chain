import React from "react";
import {
    Flex,
    Box,
    Link,
    Image,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import "./style.css"
import logo from "../../assets/logo.png";

import { useNavigate, Link as Links } from "react-router-dom";



function Navbar(props) {

    const navigate = useNavigate()
    const { owner, accounts } = props;

    const address = accounts ? accounts[0] : null;

    console.log("address", accounts);
    const shortenedAddress = address ? `${address?.slice(0, 5)}...${address.slice(-4)}` : null;
    return (
        <Flex
            bg="white"
            w="100%"
            h="60px"
            boxShadow="md"
            align="center"
            justify="space-between"
            px={4}

        >
            <Box>
                <Links to="/">
                    <Image src={logo} alt="Logo" h="40px" />
                </Links>

            </Box>
            <Box>
                <Links to="/job-listings">
                    <Link href="#" color="black" mr={8}>
                        Annonces
                    </Link>
                </Links>
                <Links to="/employer">
                    <Link href="#" color="black" mr={8}>
                        Employeur
                    </Link>
                </Links>
                {address == owner ? (
                    <Links to="/admin">
                        <Link href="#" color="black" mr={8}>
                            Administrateur
                        </Link>
                    </Links>
                ) : null}
            </Box>
            <Box>

                <Menu>
                    <MenuButton as={Link} href="#" color="black" mr={8}>
                        Nb token
                    </MenuButton>
                    <MenuList>
                        <MenuItem>
                            <Link href="#">Acheter des tokens</Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href="#">Retirer des tokens</Link>
                        </MenuItem>
                    </MenuList>
                </Menu>


                <Menu>
                    <MenuButton as={Link} href="#" color="black" mr={8}>
                        {shortenedAddress}
                    </MenuButton>
                    <MenuList>
                        <MenuItem>
                            <Links to="/profile">
                                <Link href="#">Voir mon profil</Link>
                            </Links>
                        </MenuItem>
                        <MenuItem>
                            <Links to="/add-degree">
                                <Link href="#">Ajouter un diplome</Link>
                            </Links>
                        </MenuItem>
                        <MenuItem>
                            <Links to="/add-experience">
                                <Link href="#">Ajouter une experience</Link>
                            </Links>
                        </MenuItem>
                        <MenuItem>
                            <Link href="#">Se déconnecter</Link>
                        </MenuItem>
                    </MenuList>
                </Menu>

            </Box>
        </Flex>
    );

}



export default Navbar;