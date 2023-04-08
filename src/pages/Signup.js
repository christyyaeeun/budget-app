import React from 'react';
import { useState, useContext } from 'react'
import {
    Link, useNavigate
} from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Flex,
    Heading,
    Text,
    useToast,
    Stack,
    Image,
    Box,
} from '@chakra-ui/react';
import firebase from "@firebase/app-compat";
import { AuthContext } from '../context/AuthContext';

const imgUrl = "https://firebasestorage.googleapis.com/v0/b/olt-react.appspot.com/o/olt%20photos%2Fopacity-edits%2Fa2.png?alt=media&token=c115b77a-42c0-4f1a-9a9e-eafa36a621b3"

const Signup = ({ user }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const database = firebase.database();

    //creating a formData state to hold each state for email and password
    const [ formData, setFormData ] = useState({
        email: "",
        password: "",
        username: "",
    });

    //Destructuring email and password from formData
    const { email, password, username } = formData;

    //Declaring the onChange function
    function onChange(e) {
        setFormData((prevState) => ({
            ...prevState,
            [ e.target.id ]: e.target.value,
        }));
    }

    // const { auth } = useContext(AuthContext);

    const createUser = async (uid, email, displayName) => {
        await database.ref(`users/${ uid }`).set({
            email,
            username: displayName,
            categoryGoals: {
                Housing: 0,
                Food: 0,
                Utilities: 0,
                Misc: 0,
            },
            displayName: displayName // add this line to set the displayName field
        });
    };

    //Declaring the onSubmit function
    async function onSubmit(e) {
        e.preventDefault();
        try {
            const auth = getAuth();
            const userAuth = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const userId = userAuth.user.uid;

            await createUser(userId, email, username);

            await updateProfile(userAuth.user, {
                displayName: username
            });
            toast({
                title: 'Successfully created an account.',
                description: 'Thanks for joining!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate("/home");



        } catch (error) {
            console.log(error.code, error.message)
            toast({
                title: "Sign up failed",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    return (
        <Stack minH={ '100vh' } direction={ { base: 'column', md: 'row' } }>
            <Flex p={ 8 } flex={ 1 } align={ 'center' } justify={ 'center' }>
                <Stack mt={ { base: "0", md: "-15%", lg: "-20%" } } spacing={ 4 } w={ 'full' } maxW={ 'md' }>
                    <Heading textAlign="center"> Budget App </Heading>
                    <form onSubmit={ onSubmit }>
                        <Stack direction="column" spacing="3">
                            <FormControl isRequired>
                                <FormLabel htmlFor="username">
                                    Username
                                </FormLabel>
                                <Input
                                    id="username"
                                    name="username"
                                    type="username"
                                    required
                                    placeholder="Username"
                                    onChange={ onChange }
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel htmlFor="email-address">
                                    Email address
                                </FormLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Email address"
                                    onChange={ onChange }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel htmlFor="password">
                                    Password
                                </FormLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Password"
                                    onChange={ onChange }
                                />
                            </FormControl>

                            <Box display="flex">
                                <Button type="submit" id="styled-btn">
                                    Create an Account
                                </Button>
                            </Box>
                        </Stack>
                    </form>

                    <Text textAlign="center">
                        Already have an account? { ' ' }
                        <Link to="/login" className="teal-link">
                            Sign in
                        </Link>
                    </Text>

                </Stack>
            </Flex >
            <Flex flex={ 1 }>
                <Image
                    alt={ 'Signup Image' }
                    objectFit={ 'cover' }
                    src={ imgUrl }
                />
            </Flex>
        </Stack >
    )
}

export default Signup