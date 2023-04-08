import React, {useEffect, useState} from "react";
import { Link, NavLink } from "react-router-dom";
import {
    Box,
    Flex,
    Stack,
    Text,
    IconButton,
    Collapse,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    UnorderedList,
    ListItem,
    Button,
} from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";

export default function ProtectedNav() {
    const { isOpen, onToggle } = useDisclosure();
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setIsLoggedIn(true);
            } else {
                // User is signed out
                setIsLoggedIn(false);
            }
        });
    }, []);

    function onLogout() {
        auth.signOut();
        navigate("/login");
    }
    return (
        <nav>
            <Box>
                <Flex
                    bg={ useColorModeValue('white', 'gray.800') }
                    minH={ '60px' }
                    py={ { base: 2 } }
                    px={ { base: 4 } }
                    borderBottom={ 1 }
                    borderStyle={ 'solid' }
                    borderColor={ useColorModeValue('gray.200', 'gray.900') }
                    align={ 'center' }>
                    <Flex
                        flex={ { base: 1, md: 'auto' } }
                        ml={ { base: -2 } }
                        display={ { base: 'flex', md: 'none' } }>
                        <IconButton
                            onClick={ onToggle }
                            icon={
                                isOpen ? <CloseIcon w={ 3 } h={ 3 } /> : <HamburgerIcon w={ 5 } h={ 5 } />
                            }
                            variant={ 'ghost' }
                            aria-label={ 'Toggle Navigation' }
                        />
                    </Flex>
                    <Flex flex={ { base: 1 } } justify={ { base: 'center', md: 'start' } }>
                        <Box bg="black" px="2">
                            <Text
                                textAlign={ useBreakpointValue({ base: 'center', md: 'left' }) }
                                fontFamily={ 'heading' }
                                fontWeight="900"
                                textTransform={ "uppercase" }
                                color={ useColorModeValue('white', 'black') }>
                                <Link to="/dashboard">BB</Link>
                            </Text>
                        </Box>

                        <Flex fontSize="large" fontWeight="700" display={ { base: 'none', md: 'flex' } } ml={ 10 }>
                            <nav className="nav-menu">

                                <UnorderedList listStyleType="none">
                                    <Stack direction="row" spacing="6">
                                        <ListItem><NavLink to="/home">Home</NavLink></ListItem>
                                        <ListItem><NavLink to="/dashboard">Dashboard</NavLink></ListItem>
                                        <ListItem><NavLink to="/profile">
                                            { ({ isActive }) => (
                                                <span>Profile</span>
                                            ) }
                                        </NavLink>
                                        </ListItem>
                                    </Stack>
                                </UnorderedList>
                            </nav>
                        </Flex>
                    </Flex>

                    <Stack
                        flex={ { base: 1, md: 0 } }
                        justify={ 'flex-end' }
                        direction={ 'row' }
                        spacing={ 6 }>
                        { isLoggedIn ? (


                            <React.Fragment>
                                <Button
                                    as={ 'a' }
                                    fontSize={ 'sm' }
                                    fontWeight={ 400 }
                                    variant={ 'link' }
                                    onClick={ onLogout }
                                    href={ '/login' }>
                                    Sign Out
                                </Button>


                    
                            </React.Fragment>
                        ) : (
                            <Button
                                as={ 'a' }
                                display={ { base: 'none', md: 'inline-flex' } }
                                fontSize={ 'sm' }
                                fontWeight={ 600 }
                                color={ 'white' }
                                bg={ 'black' }
                                href={ '/login' }
                                _hover={ {
                                    bg: 'pink.300',
                                } }>
                                Sign In
                            </Button>
                        ) }
                    </Stack> 
                </Flex>

                <Collapse in={ isOpen } animateOpacity>
                    <UnorderedList listStyleType="none">
                        <Stack
                            direction="column"
                            spacing="4"
                            fontWeight="700"
                            fontSize="large"
                            bg={ useColorModeValue('white', 'gray.800') }
                            p={ 2 }
                            display={ { md: 'none' } }>
                            <ListItem><NavLink to="/home">Home</NavLink></ListItem>
                            <ListItem><NavLink to="/dashboard">Dashbaord</NavLink></ListItem>
                            <ListItem><NavLink to="/profile">Profile</NavLink></ListItem>
                        </Stack>
                    </UnorderedList>
                </Collapse>
            </Box>

        </nav>
    );


}









// //  // useEffect(() => {
// //     //     const fetchUser = async () => {
// //     //         const userId = firebase.auth().currentUser?.uid; // use optional chaining to check if currentUser is null
// //     //         console.log("userId", userId)
// //     //         if (userId) {
// //     //             try {
// //     //                 const snapshot = await firebase.database().ref(`users/${ userId }`).once('value');
// //     //                 const userData = snapshot.val();
// //     //                 setUser(userData);
// //     //             } catch (error) {
// //     //                 setError(error);
// //     //             } finally {
// //     //                 setLoading(false);
// //     //             }
// //     //         }
// //     //     };

// //     //     fetchUser();
// //     // }, []);




// import { ReactNode } from 'react';
// import {
//     Box,
//     Flex,
//     Avatar,
//     Link,
//     Button,
//     Menu,
//     MenuButton,
//     MenuList,
//     MenuItem,
//     MenuDivider,
//     useDisclosure,
//     useColorModeValue,
//     Stack,
//     useColorMode,
//     Center,
// } from '@chakra-ui/react';
// import { MoonIcon, SunIcon } from '@chakra-ui/icons';

// const NavLink = ({ children }: { children: ReactNode }) => (
//     <Link
//         px={ 2 }
//         py={ 1 }
//         rounded={ 'md' }
//         _hover={ {
//             textDecoration: 'none',
//             bg: useColorModeValue('gray.200', 'gray.700'),
//         } }
//         href={ '#' }>
//         { children }
//     </Link>
// );

// export default function ProtectedNav() {
//     const { colorMode, toggleColorMode } = useColorMode();
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     return (
//         <>
//             <Box bg={ useColorModeValue('gray.100', 'gray.900') } px={ 4 }>
//                 <Flex h={ 16 } alignItems={ 'center' } justifyContent={ 'space-between' }>
//                     <Box>Logo</Box>

//                     <Flex alignItems={ 'center' }>
//                         <Stack direction={ 'row' } spacing={ 7 }>
//                             <Button onClick={ toggleColorMode }>
//                                 { colorMode === 'light' ? <MoonIcon /> : <SunIcon /> }
//                             </Button>

//                             <Menu>
//                                 <MenuButton
//                                     as={ Button }
//                                     rounded={ 'full' }
//                                     variant={ 'link' }
//                                     cursor={ 'pointer' }
//                                     minW={ 0 }>
//                                     <Avatar
//                                         size={ 'sm' }
//                                         src={ 'https://avatars.dicebear.com/api/male/username.svg' }
//                                     />
//                                 </MenuButton>
//                                 <MenuList alignItems={ 'center' }>
//                                     <br />
//                                     <Center>
//                                         <Avatar
//                                             size={ '2xl' }
//                                             src={ 'https://avatars.dicebear.com/api/male/username.svg' }
//                                         />
//                                     </Center>
//                                     <br />
//                                     <Center>
//                                         <p>Username</p>
//                                     </Center>
//                                     <br />
//                                     <MenuDivider />
//                                     <MenuItem>Your Servers</MenuItem>
//                                     <MenuItem>Account Settings</MenuItem>
//                                     <MenuItem>Logout</MenuItem>
//                                 </MenuList>
//                             </Menu>
//                         </Stack>
//                     </Flex>
//                 </Flex>
//             </Box>
//         </>
//     );
// }



