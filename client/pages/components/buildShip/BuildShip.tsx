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
  Text
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import { ethers } from "ethers"
import { EthereumContext } from '../../../context/EthereumContext'
import ShipwrightSlider from '../form/ShipwrightSlider'

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
  const { buildShip, ships } = useContext(EthereumContext)

  return (
    <>
      <Box marginTop={'1rem'}>
        <Modal isOpen={isOpen} onClose={() => onClose()}>
          <ModalOverlay />
          <ModalContent>
            <Formik
              initialValues={{
                beam: '34',
                keel: '33',
                shipLength: '33',
                wood: '10'
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
                console.log(values, "VALS")
                console.log(actions, "ACTIONS")
                const buildResult = await buildShip({
                  beam: values.beam,
                  keel: values.keel,
                  shipLength: values.shipLength,
                  wood: values.wood
                })

                const provider = new ethers.providers.Web3Provider(window.ethereum)

                provider.once(buildResult.hash, async (tx) => {
                  setTxInProgress(false)
                  console.log(`${tx.toString()} has been mined.`)
                  // TODO: show new NFT details
                  let response = await ships(currentAccount)

                  console.log(response, "RESPONSE")
                  //setUserShips(response.map((ship: any) => ship))
                })

                setTxInProgress(true)
                onClose()
              }}
            >
              {(_props) => (
                <Form>
                  <ModalCloseButton />
                  <ModalBody mt={1}>
                    <ShipwrightSlider />
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

export default BuildShip
