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


interface EmbarkProps {
  currentAccount: string | undefined
  isOpen: boolean
  onClose: Function
  onOpen: Function
  setTxInProgress: Function
  setUserShips: Function
}

const Embark = ({
  currentAccount,
  isOpen,
  onClose,
  setTxInProgress,
  setUserShips
}: EmbarkProps) => {
  //const { embark } = useContext(EthereumContext);

  return (
    <>
      <Box marginTop={'1rem'}>
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
              onSubmit={async (values, actions) => {
                //const voyageResult = await embark({ destination: "", ship: "" });
                //console.log(buildResult, "BUILDRES")

                const provider = new ethers.providers.Web3Provider(window.ethereum);

                // provider.once(buildResult.hash, async (tx) => {
                //   setTxInProgress(false);
                //   console.log(`${tx.toString()} has been mined.`)
                //   // TODO: show new NFT details
                //   let response = await ships(currentAccount);

                //   setUserShips(response.map((bigInt: any) => bigInt.toBigInt()));
                // })

                setTxInProgress(true);
                onClose();
              }}
            >
              {(_props) => (
                <Form>
                  <ModalCloseButton />
                  <ModalBody mt={1}>
                    <div>
                      Which ship to send on a voyage?
                    </div>
                    <Field name="ship">
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
                      Embark
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

export default Embark;
