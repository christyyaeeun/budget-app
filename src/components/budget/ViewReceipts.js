import React, { useState, useEffect } from 'react'
import firebase from '@firebase/app-compat';
import {
    Center,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Input,
    Button,
    Select,
    SimpleGrid,
    useBreakpointValue,
    HStack,
    IconButton,
    Box,
    FormControl,
    FormLabel,
    Spacer,
    Stack,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, CloseIcon, CheckIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router";

const categories = [ "Food", "Housing", "Utilities", "Entertainment", "Misc" ];

function ViewReceipts() {
    const [ receipts, setReceipts ] = useState([]);
    const [ editReceipt, setEditReceipt ] = useState(null);
    const [ user, setUser ] = useState(null);
    const [ date, setDate ] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                navigate("/login"); // redirect to sign-in page if user is null
            }
        });
        return unsubscribe;
    }, [ navigate ]);

    useEffect(() => {
        const userId = firebase.auth().currentUser?.uid;
        const database = firebase.database();
        const receiptsRef = database.ref(`users/${ userId }/receipts/`);

        const handleReceiptsChange = snapshot => {
            const receipts = snapshot.val();
            const receiptList = [];
            let index = 0;
            for (let id in receipts) {
                receiptList.push({ id, ...receipts[ id ], index });
                index++;
            }
            setReceipts(receiptList);
            localStorage.setItem('receipts', JSON.stringify(receiptList));
        };

        const localReceipts = JSON.parse(localStorage.getItem('receipts'));
        if (localReceipts && localReceipts.length > 0) {
            setReceipts(localReceipts);
        } else {
            receiptsRef.on('value', handleReceiptsChange);
        }

        return () => {
            receiptsRef.off('value', handleReceiptsChange);
        };
    }, []);


    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleEdit = receiptId => {
        const receiptToEdit = receipts.find(receipt => receipt.id === receiptId);
        if (receiptToEdit) {
            setEditReceipt(receiptToEdit);
            setDate(receiptToEdit.date);
        }
    };

    const handleDelete = (id) => {
        const userId = firebase.auth().currentUser?.uid;
        const database = firebase.database();
        const receiptRef = database.ref(`users/${ userId }/receipts/${ id }`);

        receiptRef.remove((error) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Deleted receipt:", id);
                const updatedReceipts = receipts.filter((receipt) => receipt.id !== id);
                setReceipts(updatedReceipts);
                localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
            }
        });
    };


    const handleSaveEdit = () => {
        const userId = firebase.auth().currentUser?.uid;
        const database = firebase.database();
        const receiptRef = database.ref(`users/${ userId }/receipts/${ editReceipt.id }`);

        const updatedReceipt = {
            ...editReceipt,
            date: date ? new Date(date).getTime() : editReceipt.date, // Update date if it has changed
        };

        receiptRef.set(updatedReceipt, (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Updated receipt:', updatedReceipt);
                const updatedReceipts = receipts.map((receipt) => {
                    if (receipt.id === editReceipt.id) {
                        return updatedReceipt;
                    }
                    return receipt;
                });
                setReceipts(updatedReceipts);
                setEditReceipt(null);
            }
        });
    };


    return (
        <Center className="receiptlist-container" flexDir={ { base: "column", large: "row" } }>
            { isMobile ? (
                <SimpleGrid columns={ { base: 1, md: 2 } } spacing={ 4 }>
                    { receipts.map((receipt) => (
                        <Box key={ receipt.index } borderWidth="1px" borderRadius="lg" overflow="hidden">
                            <Box p="6">
                                { editReceipt && editReceipt.id === receipt.id ? (
                                    <>
                                        <FormControl id="date">
                                            <FormLabel>Date</FormLabel>
                                            <Input
                                                type="date"
                                                defaultValue={ new Date(receipt.date).toISOString().substr(0, 10) }
                                                onChange={ (e) => setDate(e.target.value) }
                                            />
                                        </FormControl>
                                        <FormControl mt={ 4 } id="name">
                                            <FormLabel>Item</FormLabel>
                                            <Input
                                                type="text"
                                                defaultValue={ receipt.name }
                                                onChange={ (e) => {
                                                    setEditReceipt({ ...editReceipt, name: e.target.value });
                                                } }
                                            />
                                        </FormControl>
                                        <FormControl mt={ 4 } id="category">
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                defaultValue={ receipt.category }
                                                onChange={ (e) => {
                                                    setEditReceipt({ ...editReceipt, category: e.target.value });
                                                } }
                                            >
                                                { categories.map((category) => (
                                                    <option key={ category } value={ category }>
                                                        { category }
                                                    </option>
                                                )) }
                                            </Select>
                                        </FormControl>
                                        <FormControl mt={ 4 } id="amount">
                                            <FormLabel>Amount</FormLabel>
                                            <Input
                                                type="number"
                                                defaultValue={ receipt.amount }
                                                onChange={ (e) => {
                                                    setEditReceipt({ ...editReceipt, amount: e.target.value });
                                                } }
                                            />
                                        </FormControl>
                                        <Button mt={ 4 } colorScheme="blue" size="sm" onClick={ handleSaveEdit }>
                                            Save
                                        </Button>
                                        <Spacer />
                                        <Button ml={ 4 } mt={ 4 } colorScheme="gray" size="sm" onClick={ () => setEditReceipt(null) }>
                                            Cancel
                                        </Button>
                                        <Button ml={ 4 } mt={ 4 } colorScheme="red" size="sm" onClick={ () => handleDelete(receipt.id) }>
                                            Delete
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Box mt={ 2 } fontSize="lg" fontWeight="semibold" lineHeight="tight">
                                            { receipt.name }
                                        </Box>
                                        <Box fontSize="md">
                                            { new Date(receipt.date).toLocaleDateString() }
                                        </Box>
                                        <Box mt={ 2 } fontSize="md">
                                            Category: { receipt.category }
                                        </Box>
                                        <Box mt={ 2 } fontSize="md">
                                            Amount: ${ receipt.amount }
                                        </Box>
                                        <Stack direction="row">
                                            <IconButton variant="ghost" icon={ <EditIcon /> } onClick={ () => handleEdit(receipt.id) }>
                                                Edit
                                            </IconButton>
                                            <Spacer />
                                            <IconButton aria-label="Delete" icon={ <DeleteIcon /> } onClick={ () => handleDelete(receipt.id) } />
                                        </Stack>
                                    </>
                                ) }
                            </Box>
                        </Box>
                    )) }
                </SimpleGrid>
            ) : (
                <TableContainer>
                    <Table size="md">
                        <Thead>
                            <Tr>
                                <Th>Date</Th>
                                <Th>Item</Th>
                                <Th>Category</Th>
                                <Th isNumeric>Amount</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            { receipts.map((receipt) => (
                                <Tr key={ receipt.index }>
                                    { editReceipt && editReceipt.id === receipt.id ? (
                                        <>
                                            <Td>
                                                <Input
                                                    type="date"
                                                    defaultValue={ new Date(receipt.date).toISOString().substr(0, 10) }
                                                    onChange={ (e) => setDate(e.target.value) }
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="text"
                                                    defaultValue={ receipt.name }
                                                    onChange={ (e) => {
                                                        setEditReceipt({ ...editReceipt, name: e.target.value });
                                                    } }
                                                />
                                            </Td>
                                            <Td>
                                                <Select
                                                    defaultValue={ receipt.category }
                                                    onChange={ (e) => {
                                                        setEditReceipt({ ...editReceipt, category: e.target.value });
                                                    } }
                                                >
                                                    { categories.map((category) => (
                                                        <option key={ category } value={ category }>
                                                            { category }
                                                        </option>
                                                    )) }
                                                </Select>
                                            </Td>
                                            <Td isNumeric>
                                                <Input
                                                    type="number"
                                                    defaultValue={ receipt.amount }
                                                    onChange={ (e) => {
                                                        setEditReceipt({ ...editReceipt, amount: e.target.value });
                                                    } }
                                                />
                                            </Td>
                                            <Td>
                                                <HStack spacing={ 2 }>
                                                    <IconButton icon={ <CheckIcon /> } size="sm" onClick={ handleSaveEdit }>Save</IconButton>

                                                    <IconButton
                                                        icon={ <CloseIcon /> }
                                                        size="sm"
                                                        onClick={ () => {
                                                            setEditReceipt(null);
                                                        } }
                                                    >
                                                        Cancel
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="Delete"
                                                        icon={ <DeleteIcon /> }
                                                        onClick={ () => handleDelete(receipt.id) }
                                                    />
                                                </HStack>
                                            </Td>
                                        </>
                                    ) : (
                                        <>
                                            <Td>{ new Date(receipt.date).toLocaleDateString() }</Td>
                                            <Td>{ receipt.name }</Td>
                                            <Td>{ receipt.category }</Td>
                                            <Td isNumeric>{ `$${ receipt.amount }` }</Td>
                                            <Td>
                                                <HStack spacing={ 2 }>
                                                    <IconButton
                                                        variant="ghost"
                                                        aria-label="Edit"
                                                        icon={ <EditIcon /> }
                                                        onClick={ () => handleEdit(receipt.id) }
                                                    />
                                                </HStack>
                                            </Td>
                                        </>
                                    ) }
                                </Tr>
                            )) }
                        </Tbody>
                    </Table>
                </TableContainer>
            ) }
        </Center>
    );
}

export default ViewReceipts;