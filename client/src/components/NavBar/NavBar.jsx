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
    Badge, IconButton, Dropdown, DropdownButton, DropdownMenu, DropdownItem
} from "@chakra-ui/react";
import "./style.css"
import logo from "../../assets/logo.png";
import { BiBell } from "react-icons/bi";
import useEth from "../../contexts/EthContext/useEth";

import { useNavigate, Link as Links } from "react-router-dom";



function Navbar(props) {
    const navigate = useNavigate();
    const userETH = useEth()
    const { owner, accounts, user } = props;

    const address = accounts ? accounts[0] : null;

    console.log("userdqsdsqdqs", user);
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
                <Links to="/all-job-offers">
                    <Link href="#" color="black" mr={8}>
                        Annonces
                    </Link>
                </Links>
                {user?.userType == 1 && (
                    <Menu>
                        <MenuButton as={Link} href="#" color="black" mr={8}>
                            Employeur
                        </MenuButton>
                        <MenuList>
                            <Links to="/employer">
                                <MenuItem>
                                    <Link href="#">Voir mes annonces</Link>
                                </MenuItem>
                            </Links>
                            <Links to="/create-offer">
                                <MenuItem>
                                    <Link href="#">Créer une annonce</Link>
                                </MenuItem>
                            </Links>
                        </MenuList>
                    </Menu>
                )}

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
                        {user?.userType == 0 ? (<div>
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
                        </div>) : null}

                        <MenuItem>
                            <Link href="#">Se déconnecter</Link>
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton as={IconButton} icon={<BiBell />} variant="ghost" />
                    <Badge
                        position="absolute"
                        fontSize="0.65em"
                        backgroundColor="red"
                        color="white"
                        borderRadius="50%"
                        top="0"
                        right="-8px"
                    >
                        3
                    </Badge>
                    <MenuList>
                        <MenuItem>
                            <Link href="#">Notification 1</Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href="#">Notification 2</Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href="#">Notification 3</Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href="#">Voir toutes les notifications</Link>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>
        </Flex>
    );

}



export default Navbar;