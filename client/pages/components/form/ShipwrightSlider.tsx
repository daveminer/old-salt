import { useState } from "react"
import { Text } from '@chakra-ui/react'

import LabelledSlider from '../form/LabelledSlider'

interface GetSetSlider {
  get: number,
  set: Function
}

enum ShipDimension {
  Beam,
  Keel,
  Length
}

const sliderMin = 1
const sliderMax = 98

const balanceSliders = (
  { get: first, set: setFirst }: GetSetSlider,
  { get: second, set: setSecond }: GetSetSlider,
  diff: number
) => {
  // 1 counts as 0; there's nothing left to take.
  let remainder = (first - sliderMin) - diff

  if (remainder <= sliderMin) {
    setFirst(sliderMin)
    setSecond(second + remainder)

    return
  }

  if (remainder > sliderMax) {
    setFirst(sliderMax)
    setSecond(second + remainder)

    return
  }

  setFirst(first - diff)
}

const ShipwrightSlider = () => {
  const [buildWood, setBuildWood] = useState<number>(0)
  const [keel, setKeel] = useState<number>(34)
  const [length, setLength] = useState<number>(33)
  const [beam, setBeam] = useState<number>(33)

  const setShipShape = (dimension: ShipDimension, input: number) => {
    switch (dimension) {
      case ShipDimension.Beam:
        let beamDiff = input - beam

        setBeam(input)
        balanceSliders(
          { get: keel, set: setKeel },
          { get: length, set: setLength },
          beamDiff
        )

        break
      case ShipDimension.Keel:
        let keelDiff = input - keel

        setKeel(input)
        balanceSliders(
          { get: beam, set: setBeam },
          { get: length, set: setLength },
          keelDiff
        )

        break
      case ShipDimension.Length:
        let lengthDiff = input - length
        setLength(input)
        balanceSliders(
          { get: beam, set: setBeam },
          { get: keel, set: setKeel },
          lengthDiff
        )

        break
      default:
        throw new Error(`Invalid ship dimension: ${dimension}`)
    }
  }

  return (
    <>
      <Text>
        Commit resources to ship building
      </Text>
      <LabelledSlider
        label='wood'
        setValue={setBuildWood}
        value={buildWood}
        max={50000}
      />
      <Text>
        Features
      </Text>
      <LabelledSlider
        label='beam'
        max={98}
        setValue={(value: number) => setShipShape(ShipDimension.Beam, value)}
        value={beam}
      />
      <LabelledSlider
        label='keel'
        max={98}
        setValue={(value: number) => setShipShape(ShipDimension.Keel, value)}
        value={keel}
      />
      <LabelledSlider
        label='shipLength'
        max={98}
        setValue={(value: number) => setShipShape(ShipDimension.Length, value)}
        value={length}
      />
    </>
  )
}

export default ShipwrightSlider
