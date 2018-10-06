import React from 'react'
import { Heading as BaseHeading } from 'rebass'

/**
 * @render react
 * @name Heading
 * @example
 * <Heading />
 */
class Heading extends React.PureComponent {
  static displayName = 'Heading'

  render() {
    return <BaseHeading fontSize={5} as="h2" {...this.props} />
  }
}

Heading.h1 = props => <Heading fontSize={6} {...props} as="h1" />
Heading.h2 = props => <Heading fontSize={5} {...props} as="h2" />
Heading.h3 = props => <Heading fontSize={4} {...props} as="h3" />
Heading.h4 = props => <Heading fontSize={3} {...props} as="h4" />
Heading.h5 = props => <Heading fontSize={3} {...props} as="h5" />
Heading.h6 = props => <Heading fontSize={3} {...props} as="h6" />

Heading.h1.displayName = 'Heading1'
Heading.h2.displayName = 'Heading2'
Heading.h3.displayName = 'Heading3'
Heading.h4.displayName = 'Heading4'
Heading.h5.displayName = 'Heading5'
Heading.h6.displayName = 'Heading6'

export default Heading
