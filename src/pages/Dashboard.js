import React from 'react';
import {
    Box,
} from '@chakra-ui/react'
import CategoryGoals from '../components/budget/CategoryGoals';
import ExpenseTable from '../components/budget/ExpenseTable';

export default function Dashboard() {
  
    return (
        <>
            <Box w="lg" m="0 auto">
                <ExpenseTable />
                <CategoryGoals />
            </Box>

      

        </>
    );
}
