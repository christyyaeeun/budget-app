import React, { useState, useEffect } from 'react';
import firebase from '@firebase/app-compat';
import { Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import PieChart from './PieChart';

function Expenses(props) {
    const [ expense, setExpense ] = useState({});
    const [ expenseTotal, setExpenseTotal ] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // setUser(user);
            } else {
                navigate('/login'); // redirect to sign-in page if user is null
            }
        });
        return unsubscribe;
    }, [ navigate ]);

    useEffect(() => {
        const userId = firebase.auth().currentUser?.uid;
        if (!userId) return;
        const expensesRef = firebase.database().ref(`users/${ userId }/expenses`);
        expensesRef.on('value', (snapshot) => {
            const expenses = snapshot.val() || {}; // handle the case where expenses is null
            setExpense(expenses);
        });

        return () => {
            expensesRef.off();
        };
    }, []);

    const setExpenseTotalCategory = (category, value) => {
        setExpenseTotal((prev) => {
            return { ...prev, [ category ]: value };
        });
    };

    const updateExpenseTotal = (category, expenseAmount) => {
        setExpenseTotalCategory(
            category,
            expenseTotal[ category ] ? expenseTotal[ category ] - expenseAmount : 0
        );
    };

    return (
        <Center className='expenselist-container' flexDir='column'>
            <PieChart expenses={ expense } updateExpenseTotal={ updateExpenseTotal } />

        </Center>
    );
}

export default Expenses;
