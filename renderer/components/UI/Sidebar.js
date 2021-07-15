import React from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

const Sidebar = ({ hasShadow, ...rest }) => (
  <Flex
    as="aside"
    color="primaryText"
    flexDirection="column"
    width={4 / 12}
    {...rest}
    sx={{
      overflow: 'hidden',
      boxShadow: hasShadow ? 'm' : null,
      zIndex: 1,
    }}
  />
)

Sidebar.propTypes = {
  hasShadow: PropTypes.bool,
}

Sidebar.defaultProps = {
  hasShadow: true,
}

Sidebar.Small = props => <Sidebar {...props} width={3 / 16} />
Sidebar.Medium = props => <Sidebar {...props} width={4 / 16} />
Sidebar.Large = props => <Sidebar {...props} width={6 / 16} />

Sidebar.Small.displayName = 'Sidebar Small'
Sidebar.Medium.displayName = 'Sidebar Medium'
Sidebar.Large.displayName = 'Sidebar Large'

export default Sidebar
