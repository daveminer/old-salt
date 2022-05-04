import { extendTheme } from '@chakra-ui/react'

import "@fontsource/trade-winds"

import Button from './Button'
import Modal from './Modal'
import Tag from './Tag'

export const colors = {
  background: '#E9E5C0',
}

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  colors, components: {
    Button,
    Modal,
    Tag
  }, config,
  fonts: {
    body: 'Trade Winds',
    heading: 'Trade Winds'
  }
})

export default theme
