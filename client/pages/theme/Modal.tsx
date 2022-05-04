import type { ComponentMultiStyleConfig } from '@chakra-ui/theme'

const Modal: ComponentMultiStyleConfig = {
  parts: [
    'overlay',
    'dialogContainer',
    'dialog',
    'header',
    'closeButton',
    'body',
    'footer'
  ],
  // Styles for the base style
  baseStyle: {
    body: {
    },
    dialog: {
      bg: '#E9E5C0'
    }
  },
  sizes: {
  },
  // Styles for the visual style variations
  variants: {
    base: {}
  },
  // The default `size` or `variant` values
  defaultProps: {
    variant: 'base'
  }

}

export default Modal
