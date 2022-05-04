import { extendTheme } from '@chakra-ui/react'

import "@fontsource/trade-winds"

import Button from './Button'
import Tag from './Tag'

const colors = {
  background: '#E9E5C0',
}

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  borderRadius: "0px",
  colors, components: {
    Button,
    Tag
  }, config,
  fonts: {
    body: 'Trade Winds',
    heading: 'Trade Winds'
  }
})

export default theme
