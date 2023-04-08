import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
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
import { auth } from "../firebase/firebase"
import { AuthContext } from '../context/AuthContext';

const imgUrl = "https://firebasestorage.googleapis.com/v0/b/olt-react.appspot.com/o/olt%20photos%2Fopacity-edits%2Fa2.png?alt=media&token=c115b77a-42c0-4f1a-9a9e-eafa36a621b3"

const Login = () => {
    const [ formData, setFormData ] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext)
    const toast = useToast();

    function onChange(e) {
        setFormData((prevState) => ({
            ...prevState,
            [ e.target.id ]: e.target.value,
        }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            if (userCredential.user) {
                toast({
                    title: 'Successfully logged in.',
                    description: 'Welcome Back!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate("/home");
            }
        } catch (error) {
            console.log(error.code)
            toast({
                title: "Login failed",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }


    return (
        <>
            <Stack minH={ '100vh' } direction={ { base: 'column', md: 'row' } }>
                <Flex p={ 8 } flex={ 1 } align={ 'center' } justify={ 'center' }>
                    <Stack mt={ { base: "0", md: "-15%", lg: "-20%" } } spacing={ 4 } w={ 'full' } maxW={ 'md' }>
                        <Heading textAlign="center"> Budget App </Heading>
                        <form onSubmit={ onSubmit }>
                            <Stack direction="column" spacing="3">
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
                                        Sign In
                                    </Button>
                                </Box>
                            </Stack>
                        </form>

                        <Text textAlign="center">
                            No account yet? { ' ' }
                            <Link to="/signup" className="teal-link">
                                Sign up
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
        </>
    )
}

export default Login