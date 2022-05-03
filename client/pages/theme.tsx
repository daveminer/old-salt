import { extendTheme } from '@chakra-ui/react'

const colors = {
  background: '#E9E5C0',
}

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({ colors, config })

export default theme;
