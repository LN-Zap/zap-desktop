import React from 'react'

import { Heading as BaseHeading } from 'rebass/styled-components'

const Heading = React.forwardRef((props, ref) => {
  return (
    <BaseHeading
      color="primaryText"
      fontSize="xl"
      fontWeight="light"
      lineHeight="normal"
      ref={ref}
      {...props}
    />
  )
})

Heading.displayName = 'Heading'

Heading.H1 = props => <Heading fontSize="xxl" lineHeight="1.1" {...props} as="h1" />
Heading.H2 = props => <Heading fontSize="xl" lineHeight="1.2" {...props} as="h2" />
Heading.H3 = props => <Heading fontSize="l" lineHeight="1.3" {...props} as="h3" />
Heading.H4 = props => <Heading fontSize="m" {...props} as="h4" />
Heading.H5 = props => <Heading fontSize="m" {...props} as="h5" />
Heading.H6 = props => <Heading fontSize="m" {...props} as="h6" />

Heading.H1.displayName = 'Heading1'
Heading.H2.displayName = 'Heading2'
Heading.H3.displayName = 'Heading3'
Heading.H4.displayName = 'Heading4'
Heading.H5.displayName = 'Heading5'
Heading.H6.displayName = 'Heading6'

export default Heading
