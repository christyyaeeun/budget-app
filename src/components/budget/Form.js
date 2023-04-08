import React, { useState, forwardRef, useEffect } from "react";
import firebase from "@firebase/app-compat";
import "firebase/database";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Box,
    FormControl,
    Input,
    Stack,
    Button,
    InputGroup,
    useToast,
    Select,
} from "@chakra-ui/react";
import "@firebase/auth-compat";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router";

const CustomInput = forwardRef((props, ref) => (
    <>
        <Input className="custom-input" type="text" ref={ ref } { ...props } />
    </>
));


const categories = [ 'Housing', 'Utilities', 'Food', 'Entertainment', 'Misc' ]
function Form() {
    const [ name, setName ] = useState("");
    const [ amount, setAmount ] = useState("");
    const [ category, setCategory ] = useState("");
    const [ date, setDate ] = useState(new Date());

    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {

            } else {
                navigate("/login"); // redirect to sign-in page if user is null
            }
        });
        return unsubscribe;
    }, [ navigate ]);

    // useEffect(() => {
    //     const userId = firebase.auth().currentUser?.uid;
    //     if (!userId) return;

    //     const expensesRef = firebase.database().ref(`users/${ userId }/expenses`);
    //     expensesRef.on("value", (snapshot) => {
    //         const expensesData = snapshot.val();
    //         if (!expensesData) return;
    //         const expensesArray = Object.keys(expensesData).map((key) => {
    //             return { ...expensesData[ key ], name: key };
    //         });
    //     });

    //     return () => {
    //         expensesRef.off("value");
    //     };
    // }, []);

    useEffect(() => {
        const userId = firebase.auth().currentUser?.uid;
        if (!userId) return;

        const expensesRef = firebase.database().ref(`users/${ userId }/expenses`);
        expensesRef.on("value", (snapshot) => {
            const expensesData = snapshot.val();
            if (!expensesData) return;
            Object.keys(expensesData).map((key) => {
                return { ...expensesData[ key ], name: key };
            });
        });

        return () => {
            expensesRef.off("value");
        };
    }, []);

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        const expense = categories.find((b) => b === selectedCategory);
        setCategory(selectedCategory);
        setAmount('');
    };

    const handleChange = (date) => {
        setDate(date);
    };

    function handleSubmit(e) {
        e.preventDefault();
        const userId = firebase.auth().currentUser?.uid; // use optional chaining to check if currentUser is null

        if (!userId) {
            return; // do nothing if user is null
        }

        const regex = /^[^.#$/[\]]+$/; // regular expression to match allowed characters
        const receiptId = uuidv4().replace(/-/g, ''); // generate UUID and remove dashes
        const isValidReceiptId = regex.test(receiptId); // check if receipt ID is valid

        if (!isValidReceiptId) {
            // handle invalid receipt ID (e.g., show error message)
            return;
        }

        const receipt = {
            id: receiptId,
            name,
            amount,
            category,
            createdDate: new Date().toLocaleDateString("en-US", { timeZone: "UTC" }),
            date: new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" }),
        };

        const receiptsRef = firebase.database().ref(`users/${ userId }/receipts`);
        receiptsRef.push(receipt);

        // const categoryRef = firebase.database().ref(`users/${ userId }/categoryGoals/${ category }`);
        // categoryRef.once("value", (snapshot) => {
        //     const expense = snapshot.val();
        //     const newTotal = expense - parseInt(amount);
        //     categoryRef.set(newTotal);
        // });

        const expenseRef = firebase.database().ref(`users/${ userId }/expenses/${ category }`);
        expenseRef.once("value", (snapshot) => {
            const expense = snapshot.val();
            const expenseTotal = parseInt(amount);
            expenseRef.set(expenseTotal);
        });

        const budgetTotalRef = firebase.database().ref(`users/${ userId }/budget/${ category }`);
        budgetTotalRef.once("value", (snapshot) => {
            const budgetTotal = snapshot.val();
            const newTotal = budgetTotal - parseInt(amount);
            budgetTotalRef.set(newTotal);
        });


        toast({
            title: "Receipt Saved.",
            description: "Successfully saved your receipt.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });

        setName("");
        setAmount("");
        setCategory("");
        setDate(new Date());
    }

    return (
        <Box w="100%" m="auto" pt="5">
            <form onSubmit={ handleSubmit }>
                <Stack spacing={ 4 }>
                    <FormControl isRequired>
                        <Stack direction="column" spacing="3">
                            <Select
                                placeholder="Category"
                                value={ category }
                                onChange={ handleCategoryChange }
                            >
                                { categories.map((category) => (
                                    <option key={ category.name } value={ category.name }>
                                        { category }
                                    </option>
                                )) }
                            </Select>
                        </Stack>
                    </FormControl>
                    <FormControl isRequired>
                        <Input
                            placeholder="Name"
                            type="text"
                            value={ name }
                            onChange={ (e) => setName(e.target.value) }
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <Input
                            placeholder="Amount"
                            type="text"
                            value={ amount }
                            onChange={ (e) => setAmount(e.target.value) }
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <InputGroup mt="2">
                            <DatePicker selected={ date } onChange={ handleChange } customInput={ <CustomInput /> } popperPlacement="right" />
                        </InputGroup>
                    </FormControl>
                    <Button type="submit" bg="black" color="white" size="lg">
                        Save
                    </Button>
                </Stack>
            </form>
        </Box>
    );

}

export default Form