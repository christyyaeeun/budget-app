import React, { useState, useEffect } from 'react';
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
    Box,
} from '@chakra-ui/react';

function ExpenseTable(props) {
    const [ expenses, setExpenses ] = useState({});

    useEffect(() => {
        const userId = firebase.auth().currentUser?.uid;
        if (!userId) return;
        const expensesRef = firebase.database().ref(`users/${ userId }/expenses`);
        expensesRef.on('value', (snapshot) => {
            const expenses = snapshot.val() || {}; // handle the case where expenses is null
            setExpenses(expenses);
        });

        return () => {
            expensesRef.off();
        };
    }, []);

    return (
        <Box p="3em">
            <TableContainer>
                <Table size="sm">
                    <Thead>
                        <Tr>
                            <Th>Category</Th>
                            <Th isNumeric>Total</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        { Object.entries(expenses).map(([ category, total ]) => (
                            <Tr key={ category }>
                                <Td>{ category }</Td>
                                <Td isNumeric>{ total }</Td>
                            </Tr>
                        )) }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ExpenseTable;
