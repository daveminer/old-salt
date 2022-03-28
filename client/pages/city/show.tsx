import React from "react";
import { Button } from '@chakra-ui/react'

interface CityDetailsProps {
  city: string
}

const CityDetails = ({ city }: CityDetailsProps) => {
  return (
    <>
      <label>{city}</label>
      <Button>
        Back to city list
      </Button>
      <Button>
        Back to shipyard
      </Button>
    </>
  );
};

export default CityDetails;
