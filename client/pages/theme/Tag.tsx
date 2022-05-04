import type { ComponentMultiStyleConfig } from '@chakra-ui/theme'

const Tag: ComponentMultiStyleConfig = {
  parts: ['closeButton', 'container', 'label'],
  // Styles for the base style
  baseStyle: {
    container: {
      borderColor: 'black',
      borderWidth: '1px',
      marginLeft: 2,
      marginRight: 2
    }
  },
  sizes: {
    lg: {
      container: {
        borderRadius: 'none',
      }
    }
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

export default Tag
