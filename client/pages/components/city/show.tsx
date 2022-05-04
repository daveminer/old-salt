import React from "react";
import { Box, Button, Flex, Heading, SimpleGrid } from '@chakra-ui/react'

interface CityDetailsProps {
  city: string,
  population: Number,
  setScreen: Function
}

const CityDetails = ({ city, population, setScreen }: CityDetailsProps) => {
  return (
    <>
      <Heading size='xl'>{city}</Heading>
      <Heading marginBottom='8' size='md'>Population: {population}</Heading>
      <SimpleGrid columns={2} width='100%'>
        <Box marginLeft={16}>
          <Heading size='md'>Goods</Heading>
          <ul>
            <li>Wood: 100</li>
            <li>Food: 100</li>
            <li>Iron: 100</li>
            <li>Cloth: 100</li>
            <li>Spice: 100</li>
          </ul>
        </Box>
      </SimpleGrid>
    </>
  );
};

export default CityDetails;
