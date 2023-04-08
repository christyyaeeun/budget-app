import React, { useEffect, useState, useCallback } from 'react';
import firebase from "@firebase/app-compat";
import {
    Box,
    Card,
    CardBody,
    Heading,
    Stack,
    Input,
    Button,
    IconButton,
    useToast,
} from '@chakra-ui/react'
import '../../firebase/firebase'
import { CloseIcon, CheckIcon, DeleteIcon } from '@chakra-ui/icons';
import { BsPlus, BsThreeDotsVertical } from 'react-icons/bs'

interface CategoryCardProps {
    category: string;
    value: number;
    onChange: (category: string, value: number) => void;
    onDelete: (category: string) => void;
}

function CategoryCard(props: CategoryCardProps) {
    const { category, value, onChange } = props;
    const [ isEditing, setIsEditing ] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        onChange(category, value);
    };

    return (
        <Card direction="row" overflow='hidden' variant='outline' mt="1em">
            <CardBody>
                <Stack direction="row">
                    <Heading fontSize="xl">{ category }</Heading>
                    <Box>${ value }</Box>
                    { isEditing ? (
                        <Stack direction="row" alignItems="center">
                            <Input
                                type="number"
                                value={ value }
                                onChange={ (e) => onChange(category, parseInt(e.target.value)) }

                            />
                            <IconButton
                                size="sm"
                                icon={ <CheckIcon /> }
                                onClick={ handleSave }
                            >
                                Save
                            </IconButton>
                            <IconButton
                                size="sm"
                                icon={ <CloseIcon /> }
                                onClick={ () => setIsEditing(false) }
                            >
                                Cancel
                            </IconButton>
                            <IconButton
                                variant="ghost"
                                size="sm"
                                icon={ <DeleteIcon /> }
                                onClick={ () => props.onDelete(category) }
                            >
                                Delete
                            </IconButton>
                        </Stack>
                    ) : (
                        <Box w="100%" display="flex" justifyContent="flex-end">
                            <IconButton
                                variant="ghost"
                                size="sm"
                                icon={ <BsThreeDotsVertical /> }
                                onClick={ handleEdit }
                            >
                                Edit
                            </IconButton>
                        </Box>
                    ) }
                </Stack>
            </CardBody>
        </Card>
    )
}
interface CategoryGoalsProps {
    userId: string;
}

const CategoryGoal = ({ userId }: CategoryGoalsProps) => {
    const categories = [ "Housing", "Food", "Utilities", "Entertainment", "Misc" ];
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ category, setCategory ] = useState('');
    const [ categoryValue, setCategoryValue ] = useState('');
    const [ showInputs, setShowInputs ] = useState(false);
    
    const [ categoryGoals, setCategoryGoals ] = useState({
        Housing: 0,
        Food: 0,
        Utilities: 0,
        Entertainment: 0,
        Misc: 0,
    });

    const categoryOptions = categories.map(category => ({
        value: category,
        label: category
    }));

    const [ selectedCategory, setSelectedCategory ] = useState(categoryOptions[ 0 ]);
    const toast = useToast();

    useEffect(() => {
        const fetchUser = async () => {
            const userId = firebase.auth().currentUser?.uid;
            console.log("userId", userId);
            if (userId) {
                try {
                    const snapshot = await firebase.database().ref(`users/${ userId }`).once("value");
                    const userData = snapshot.val();
                    console.log("userData", userData);
                    setUser(userData);
                    setCategoryGoals(userData.categoryGoals);
                } catch (error) {
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    useEffect(() => {
        const userId = firebase.auth().currentUser?.uid;
        if (userId) {
            const categoryGoalsRef = firebase.database().ref(`users/${ userId }/categoryGoals`);
            categoryGoalsRef.on("value", (snapshot) => {
                const categoryGoalsData = snapshot.val();
                console.log("categoryGoalsData", categoryGoalsData);
                setCategoryGoals(categoryGoalsData || {});
            });
            return () => {
                categoryGoalsRef.off("value");
            };
        }
    }, []);



    const handleSubmit = (event) => {
        event.preventDefault();
        const userId = firebase.auth().currentUser?.uid;
        firebase
            .database()
            .ref(`users/${ userId }/categoryGoals`)
            .set(categoryGoals)
            .then(() => {
                console.log("Category goals updated successfully");
                const newCategoryGoals = { ...categoryGoals, [ category ]: categoryValue };
                setCategoryGoals(newCategoryGoals);
                toast({
                    title: "Added New Category",
                    description: "New category created",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                setShowInputs(false); // revert back to the card with icon
            })
            .catch((error) => { });
    };


    const onChange = (category, newGoal) => {
        setCategoryGoals((prevGoals) => ({
            ...prevGoals,
            [ category ]: newGoal,
        }));
        const userId = firebase.auth().currentUser?.uid;
        firebase
            .database()
            .ref(`users/${ userId }/categoryGoals/${ category }`)
            .set(newGoal)
            .then(() => {
                console.log(`Category goal for ${ category } updated successfully`);
            })
            .catch((error) => {
                console.log(`Error updating category goal for ${ category }:`, error);
            });
    };


    const handleCategoryGoalChange = (category, newGoal) => {
        setCategoryGoals((prevGoals) => ({
            ...prevGoals,
            [ category ]: newGoal,
        }));
        onChange(category, newGoal); // call the onChange prop to update Firebase
    };

    // const deleteCategory = useCallback((category, onCategoryDeleted) => {
    //     const userId = firebase.auth().currentUser?.uid;
    //     const goalRef = firebase.database().ref(`users/${ userId }/categoryGoals/${ category }`);
    //     goalRef.remove().then(() => {
    //         const updatedGoals = { ...categoryGoals };
    //         delete updatedGoals[ category ];
    //         onCategoryDeleted(updatedGoals);
    //     }).catch((error) => {
    //         console.log(`Error deleting category ${ category }:`, error);
    //     });
    // }, [ categoryGoals ]);

    const deleteCategory = useCallback((category, onCategoryDeleted) => {
        const userId = firebase.auth().currentUser?.uid;
        const goalRef = firebase.database().ref(`users/${ userId }/categoryGoals/${ category }`);
        goalRef
            .remove()
            .then(() => {
                console.log(`Category ${ category } deleted successfully`);
                toast({
                    title: 'Deleted Category',
                    description: `Deleted category: ${ category }`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setCategoryGoals((prevGoals) => ({
                    ...prevGoals,
                    [ category ]: 0,
                }));
                onCategoryDeleted(); // call the onCategoryDeleted prop to update parent component state
            })
            .catch((error) => {
                console.log(`Error deleting category ${ category }:`, error);
            });
    }, []);



    const handleCategorySelection = useCallback((selectedCategory) => {
        const categoryStr = JSON.stringify(selectedCategory);
        deleteCategory(categoryStr, (updatedGoals) => {
            setCategoryGoals(updatedGoals);
        });
        setSelectedCategory((prevSelectedCategory) => {
            if (prevSelectedCategory.value === selectedCategory.value) {
                return categoryOptions[ 0 ];
            }
            return prevSelectedCategory;
        });
    }, [ categoryGoals, setSelectedCategory, categoryOptions, deleteCategory ]);


    return (
        <Box>
            <h2>{ user && user.username }</h2>
            { user?.categoryGoals &&
                Object.keys(user.categoryGoals).map((category) => (
                    <CategoryCard
                        key={ category }
                        category={ category }
                        value={ categoryGoals[ category ] }
                        onChange={ handleCategoryGoalChange }
                        // onDelete={ deleteCategory }
                        onDelete={ () => deleteCategory(category) }

                    />
                )) }


            { showInputs ? (
                <Box mt="2em">
                    <form onSubmit={ handleSubmit }>
                        <Stack direction="row" alignItems="flex-end">
                            <Box flex="1" mr="1em">
                                <Input
                                    placeholder="Enter a category name"
                                    value={ category }
                                    onChange={ (e) => setCategory(e.target.value) }
                                />
                            </Box>
                            <Box flex="1" mr="1em">
                                <Input
                                    type="number"
                                    value={ categoryValue.toString() }
                                    onChange={ (e) => setCategoryValue(parseInt(e.target.value)) }
                                />
                            </Box>
                            <Button
                                colorScheme="green"
                                type="submit"
                                disabled={ !category || !categoryValue }
                                onClick={ () => {
                                    handleCategoryGoalChange(category, parseInt(categoryValue));
                                    setCategory('');
                                    setCategoryValue('');
                                } }
                            >
                                Add Category
                            </Button>
                        </Stack>
                    </form>
                </Box>
            ) : (
                <Card onClick={ () => {
                    setCategory('New Category');
                    setCategoryValue('');
                    setShowInputs(true)
                } } direction="row" overflow='hidden' variant='outline' mt="1em">
                    <CardBody>
                        <Box display="flex" justifyContent="center" fontSize="3xl" color="gray.500">
                            <BsPlus />                            </Box>
                    </CardBody>
                </Card>

            ) }
        </Box>

    );
};


export default CategoryGoal