import React from 'react'

import PropTypes from 'prop-types'

// don't update a tab if it's currently hidden
const shouldUpdate = (prevProps, nextProps) => !nextProps.isActive

const Tab = React.memo(({ children }) => <>{children}</>, shouldUpdate)
Tab.displayName = 'Tab'

Tab.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Tab
