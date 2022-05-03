import { useContext } from "react";
import {
  Box,
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

import { ethers } from "ethers";
import { EthereumContext } from '../../context/EthereumContext'


interface BuildShipProps {
  currentAccount: string | undefined
  isOpen: boolean
  onClose: Function
  onOpen: Function
  setTxInProgress: Function
  setUserShips: Function
}

const BuildShip = ({
  currentAccount,
  isOpen,
  onClose,
  setTxInProgress,
  setUserShips
}: BuildShipProps) => {
  const { buildShip, ships } = useContext(EthereumContext);

  return (
    <>
      <Box marginTop={'1rem'}>
        <Modal isOpen={isOpen} onClose={() => onClose()}>
          <ModalOverlay />
          <ModalContent>
            <Formik
              initialValues={{
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
              onSubmit={async (values, actions) => {
                const buildResult = await buildShip({ wood: values.wood });

                const provider = new ethers.providers.Web3Provider(window.ethereum);

                provider.once(buildResult.hash, async (tx) => {
                  setTxInProgress(false);
                  console.log(`${tx.toString()} has been mined.`)
                  // TODO: show new NFT details
                  let response = await ships(currentAccount);

                  setUserShips(response.map((bigInt: any) => bigInt.toBigInt()));
                })

                setTxInProgress(true);
                onClose();
              }}
            >
              {(_props) => (
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
      </Box>
    </>
  )
}

export default BuildShip;
