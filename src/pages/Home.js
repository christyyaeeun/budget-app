import React from 'react';
import {
    Heading,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Stack,
} from '@chakra-ui/react'
import Form from '../components/budget/Form';
import GoalSetter from '../components/budget/GoalSetter';
import ViewReceipts from '../components/budget/ViewReceipts';
import Expenses from '../components/budget/Expenses';

export default function Home() {
    const {
        isOpen: isOpenTrackerModal,
        onOpen: onOpenTrackerModal,
        onClose: onCloseTrackerModal
    } = useDisclosure()

    const {
        isOpen: isOpenFormModal,
        onOpen: onOpenFormModal,
        onClose: onCloseFormModal
    } = useDisclosure()
    return (
        <div className="home-container">
            <Box display="flex" flexDir="column" alignItems="center" mt="1em">
                <Stack direction="column" spacing="3">
                    <Heading>Expense Tracker</Heading>
                    <Expenses />
                    <ViewReceipts />
                    <Stack direction="row" spacing="3">
                        <Box w="150px">
                            <Button id="styled-btn" mt="2" onClick={ onOpenTrackerModal }>Set Budget</Button>
                        </Box>
                        <Modal isOpen={ isOpenTrackerModal } onClose={ onCloseTrackerModal } >
                            <ModalOverlay />
                            <ModalContent w="300px" h="300px">
                                <ModalHeader pb="0">Select Category</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <GoalSetter />
                                </ModalBody>
                            </ModalContent>
                        </Modal>

                        <Box w="150px">
                            <Button id="styled-btn" mt="2" onClick={ onOpenFormModal }>Submit Receipt</Button>
                        </Box>
                        <Modal isOpen={ isOpenFormModal } onClose={ onCloseFormModal } >
                            <ModalOverlay />
                            <ModalContent w="500px" h="450px">
                                <ModalHeader pb="0">Expense Form</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Form />
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </Stack>
                </Stack>
            </Box>
        </div>

    )
}


