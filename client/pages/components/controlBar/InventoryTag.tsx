import { Tag } from '@chakra-ui/react'

import { capitalize } from '../../helpers'

interface InventoryTagProps {
  bgColor?: string,
  label: string,
  size?: string,
  value: number,
  verticalAlign?: string
}

const InventoryTag = ({
  bgColor = 'none',
  label,
  size = 'lg',
  value,
  verticalAlign = 'middle'
}: InventoryTagProps) => {
  return (
    <Tag
      background={bgColor}
      size={size}
      verticalAlign={verticalAlign}
    >
      {`${capitalize(label)}: ${value}`}
    </Tag>
  )
}

export default InventoryTag
