import React from 'react';
import { VictoryPie, VictoryLabel } from 'victory';
import { Stack, Text, Box, Circle, } from '@chakra-ui/react'

function PieChart(props) {
    const { expenses, updateTotal } = props;

    const data = Object.entries(expenses).map(([ category, total ]) => ({
        category: category,
        total: total < 0 ? -total : total, // convert negative totals to positive
    }));

    const colorScale = [ "#788cfc", "#37ccb8", "#ffce41", "#ffaa44", "#08c874" ];
    const totalExpenses = Math.abs(Object.values(expenses).reduce((acc, curr) => acc + curr, 0));
    const categories = [ "Entertainment", "Food", "Housing", "Utilities", "Misc" ];

    return (
        <>
            <Box display="flex" justifyContent="center" id="piechart">
                <Stack direction={ { base: "column", md: "row" } } my="2em" alignItems="center" w={ { base: "350px", md: "500px", lg: "600px" } }>
                    <svg viewBox="0 0 350 350">
                        <VictoryPie
                            standalone={ false }
                            width={ 350 }
                            height={ 350 }
                            data={ data }
                            x="category"
                            y="total"
                            colorScale={ colorScale }
                            innerRadius={ 80 }
                            labels={ () => null } // set labels to null to remove them
                        />

                        <VictoryLabel
                            textAnchor="middle"
                            verticalAnchor="middle"
                            x={ 175 }
                            y={ 175 }
                            style={ { fontSize: 20 } }
                            text={ `Total: $${ totalExpenses }` }
                        />
                    </svg>
                    <Box>
                        <Stack spacing={ 4 } justifyContent="center" direction={ { base: "column", md: "column", lg: "column" } }>
                            { categories.map((category, index) => (
                                <Stack key={ index } direction="row" alignItems="center">
                                    {/* <Tag background={ colorScale[ index ] } size="sm" variant="solid" /> */ }
                                    <Circle background={ colorScale[ index ] } size="15px" variant="solid" />

                                    <Text fontSize={ { base: "sm", md: "md", lg: "lg" } }>{ category }</Text>
                                </Stack>
                            )) }
                        </Stack>
                    </Box>
                </Stack>

            </Box>
            {/* <Stack spacing={ 4 } justifyContent="center" direction={ { base: "column", md: "row", lg: "row" } }>
                { categories.map((category, index) => (
                    <HStack key={ index } direction={ { base: "column", lg: "row" } }>
                        <Tag background={ colorScale[ index ] } variant="solid" />
                        <Text>{ category }</Text>
                    </HStack>
                )) }
            </Stack> */}
        </>
    );
}

export default PieChart;
