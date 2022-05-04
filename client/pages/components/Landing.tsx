import React from 'react'

import { Center, Heading, VStack } from '@chakra-ui/react'

const Landing = () =>
  <Center flex={1}>
    <VStack >
      <Heading marginBottom={12} size='2xl'>Old Salt</Heading>
      <Heading size='md'>A high seas NFT adventure</Heading>
    </VStack>
  </Center>

export default Landing
