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

Sidebar.small = props => <Sidebar {...props} width={3 / 16} />
Sidebar.medium = props => <Sidebar {...props} width={4 / 16} />
Sidebar.large = props => <Sidebar {...props} width={6 / 16} />

Sidebar.small.displayName = 'Sidebar Small'
Sidebar.medium.displayName = 'Sidebar Medium'
Sidebar.large.displayName = 'Sidebar Large'

export default Sidebar
