import { useContext } from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    NumberInput,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputField,
    NumberInputStepper
  } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik';

import { EthereumContext } from '../../context/EthereumContext'

import styles from './BuildShip.module.css';

interface BuildShipParams {
  isOpen: boolean
  onClose: Function
  onOpen: Function
}

const BuildShip = ({ isOpen, onClose }: BuildShipParams) => {
  const { buildShip } = useContext(EthereumContext);

  return (
    <>
      <div className={styles.buildShipForm}>
      <Modal isOpen={isOpen} onClose={() => onClose()}>
              <ModalOverlay />
              <ModalContent>
        <Formik
          initialValues={{
            tar: '3',
            wood: '10'
          }}
          validate={values => {
            console.log(values, "VALIDATE");
            const errors = {};
            // if (!values.tar) {
            //   errors.tar = 'Required';
            // } else if (
            //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.tar)
            // ) {
            //   errors.tar = 'Invalid email address';
            // }
            return errors;
          }}
          onSubmit={(values, actions) => {
            console.log("HITTT");
            buildShip({ tar: values.tar, wood: values.wood });
          }}
        >
          {(props) => (
            <Form>
              <ModalCloseButton />
              <ModalBody mt={1}>
                <div>
                  Commit resources to ship building
                </div>
                <Field name="wood">
                  {({ field, form }: any) => (
                    <NumberInput {...field} allowMouseWheel defaultValue={10} min={10} max={1000000}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                </Field>
                <Field name="tar">
                  {({ field, form }: any) => (
                    <NumberInput {...field} allowMouseWheel defaultValue={3} min={3} max={1000000}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button type='submit'>
                  Begin building
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
        </ModalContent>
        </Modal>
      </div>
    </>
  )
}

export default BuildShip;