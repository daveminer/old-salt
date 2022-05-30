import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import { capitalize } from '../../helpers'

interface LabelledSliderProps {
  label: string
  max?: number,
  setValue: Function,
  value: number
}

const LabelledSlider = ({
  label,
  max = 100,
  setValue,
  value
}: LabelledSliderProps) => {
  return (
    <>
      <Text>
        {`${capitalize(label)}: ${value}`}
      </Text>
      <Field name="crew">
        {({ field, form }: any) => (
          <Slider
            aria-label='slider-ex-1'
            onChange={(val) => setValue(val)}
            max={max}
            value={value}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        )}
      </Field>
    </>
  )
}

export default LabelledSlider
