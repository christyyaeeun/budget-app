import React, { useState, useEffect } from 'react'
import { Button, Input, Box, Stack } from '@chakra-ui/react'
import { Select } from 'chakra-react-select';
import firebase from "@firebase/app-compat";
import '../../firebase/firebase'

export default function GoalSetter({ userId }) {
    const [ user, setUser ] = useState(null);

    const [ categoryOptions, setCategoryOptions ] = useState([
        { value: 'Housing', label: 'Housing' },
        { value: 'Food', label: 'Food' },
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Misc', label: 'Misc' },
    ]);
    const [ selectedCategory, setSelectedCategory ] = useState(null);
    const [ categoryGoals, setCategoryGoals ] = useState({
        Housing: 0,
        Food: 0,
        Utilities: 0,
        Entertainment:0,
        Misc: 0,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedCategory && selectedCategory.value in categoryGoals) {
            const userId = firebase.auth().currentUser?.uid;
            // Call your Firebase update function here to save the updated category goal to the database
            firebase
                .database()
                .ref(`users/${ userId }/categoryGoals/${ selectedCategory.value }`)
                .set(categoryGoals[ selectedCategory.value ]);

            // Reset the state of the selected category and category goals
            setSelectedCategory(null);
            setCategoryGoals({
                ...categoryGoals,
                [ selectedCategory.value ]: 0,
            });
        }
    };

    const handleCategoryGoalChange = (category, newGoal) => {
        setCategoryGoals((prevGoals) => ({
            ...prevGoals,
            [ category ]: newGoal,
        }));
    };

    const updateCategoryGoal = (category, expenseAmount) => {
        setCategoryGoals((prevGoals) => ({
            ...prevGoals,
            [ category ]: prevGoals[ category ] - expenseAmount,
        }));
    };

    useEffect(() => {
        const expensesRef = firebase
            .database()
            .ref(`users/${ userId }/expenses`);
        expensesRef.on('child_added', (snapshot) => {
            const expense = snapshot.val();
            updateCategoryGoal(expense.category, expense.amount);
        });

        return () => {
            expensesRef.off();
        };
    }, [ userId ]);

    return (
        <>
            <form onSubmit={ handleSubmit }>
                <Stack spacing="3">
                    <Select
                        options={ categoryOptions }
                        value={ selectedCategory }
                        onChange={ (option) => setSelectedCategory(option) }
                        isClearable={ true }
                    />
                    { selectedCategory && (
                        <Input
                            type="number"
                            value={ categoryGoals[ selectedCategory.value ] }
                            onChange={ (e) =>
                                handleCategoryGoalChange(selectedCategory.value, e.target.value)
                            }
                        />
                    ) }
                    <Box display="flex">
                        <Button id="styled-btn" type="submit">Update Goal</Button>
                    </Box>
                </Stack>
            </form>
        </>

    )
}
