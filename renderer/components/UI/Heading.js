import React from 'react'
import { Heading as BaseHeading } from 'rebass/styled-components'

const Heading = React.forwardRef((props, ref) => {
  return (
    <BaseHeading
      ref={ref}
      color="primaryText"
      fontSize="xl"
      fontWeight="light"
      lineHeight="normal"
      {...props}
    />
  )
})

Heading.displayName = 'Heading'

Heading.h1 = props => <Heading fontSize="xxl" lineHeight="1.1" {...props} as="h1" />
Heading.h2 = props => <Heading fontSize="xl" lineHeight="1.2" {...props} as="h2" />
Heading.h3 = props => <Heading fontSize="l" lineHeight="1.3" {...props} as="h3" />
Heading.h4 = props => <Heading fontSize="m" {...props} as="h4" />
Heading.h5 = props => <Heading fontSize="m" {...props} as="h5" />
Heading.h6 = props => <Heading fontSize="m" {...props} as="h6" />

Heading.h1.displayName = 'Heading1'
Heading.h2.displayName = 'Heading2'
Heading.h3.displayName = 'Heading3'
Heading.h4.displayName = 'Heading4'
Heading.h5.displayName = 'Heading5'
Heading.h6.displayName = 'Heading6'

export default Heading
