import React from "react";
import {
  Box,
  Stack,
  Table,
  Tbody,
  Thead,
  Td,
  Th,
  Tr,
} from '@chakra-ui/react';
import { GameScreen } from "..";

interface CityListProps {
  setCurrentCity: Function
  setCurrentScreen: Function
}

const cities = [
  { distance: 100, name: 'Ashumont', population: 100 },
  { distance: 50, name: 'Brogin', population: 1000 },
  { distance: 120, name: 'Floburn', population: 10000 },
  { distance: 12, name: 'Gugas', population: 5000 },
  { distance: 200, name: 'Jatbend', population: 150 },
  { distance: 128, name: 'Yeaton', population: 3500 },
  { distance: 65, name: 'Zrey', population: 6000 }
]

const CityList = ({ setCurrentCity, setCurrentScreen }: CityListProps) => {
  return (
    <Stack
      w='full'
    >
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Distance</Th>
              <Th>Population</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cities.map((city) => {
              return (
                <Tr
                  key={city.name}
                  _hover={{
                    background: '#D3D3D3'
                  }}
                  onClick={() => {
                    setCurrentCity(city.name);
                    setCurrentScreen(GameScreen.CityDetail);
                  }}
                >
                  <Td>
                    {city.name}
                  </Td>
                  <Td>
                    {city.distance}
                  </Td>
                  <Td>
                    {city.population}
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Box>
    </Stack>
  );
};

export default CityList;
