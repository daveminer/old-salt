import { useContext, useState } from "react"
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import { ethers } from "ethers"
import { EthereumContext } from '../../../context/EthereumContext'
import LabelledSlider from '../form/LabelledSlider'

interface EmbarkProps {
  currentAccount: string | undefined
  isOpen: boolean
  onClose: Function
  onOpen: Function
  setTxInProgress: Function
  setShips: Function
  ships: string[]
}

const Embark = ({
  isOpen,
  onClose,
  setTxInProgress,
  ships
}: EmbarkProps) => {
  const { embark } = useContext(EthereumContext)

  const [crewCount, setCrewCount] = useState(0)
  const [foodCount, setFoodCount] = useState(0)
  const [porcelainCount, setPorcelainCount] = useState(0)

  return (
    <>
      <Box marginTop={'1rem'}>
        <Modal isOpen={isOpen} onClose={() => onClose()}>
          <ModalOverlay />
          <ModalContent>
            <Formik
              initialValues={{
                ship: ''
              }}
              validate={values => {
                console.log(values, "VALIDATE")
                const errors = {}
                // if (!values.tar) {
                //   errors.tar = 'Required';
                // } else if (
                //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.tar)
                // ) {
                //   errors.tar = 'Invalid email address';
                // }
                return errors
              }}
              onSubmit={async (values, actions) => {
                console.log(values, "VALUES")
                const voyageResult = await embark({ shipIndex: values.ship })
                //console.log(buildResult, "BUILDRES")

                const provider = new ethers.providers.Web3Provider(window.ethereum)

                // provider.once(buildResult.hash, async (tx) => {
                //   setTxInProgress(false);
                //   console.log(`${tx.toString()} has been mined.`)
                //   // TODO: show new NFT details
                //   let response = await ships(currentAccount);

                //   setUserShips(response.map((bigInt: any) => bigInt.toBigInt()));
                // })

                setTxInProgress(true)
                onClose()
              }}
            >
              {(_props) => (
                <Form>
                  <ModalCloseButton />
                  <ModalBody mt={1}>
                    <Box
                      marginBottom={4}
                    >
                      Which ship to send on a voyage?
                    </Box>
                    <Field name="ship">
                      {({ field, form }: any) => (
                        <Select
                          {...field}
                          placeholder='Select vessel...'
                          marginBottom="2rem"
                        >
                          {
                            ships.map((ship: any) => {
                              console.log(ship, "INP")
                              return (
                                <option key={`${ship.shipIndex}`} value={`${ship.shipIndex}`}>{`${ship.shipIndex}`}</option>
                              )
                            })
                          }
                        </Select>
                      )}
                    </Field>
                    <LabelledSlider
                      label='crew'
                      max={1000}
                      setValue={setCrewCount}
                    />
                    <LabelledSlider
                      label='food'
                      max={10000}
                      setValue={setFoodCount}
                    />
                    <LabelledSlider
                      label='food'
                      max={10000}
                      setValue={setPorcelainCount}
                    />
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

export default Embark
