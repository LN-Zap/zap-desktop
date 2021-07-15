import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'

const Bar = ({ sx, variant, ...rest }) => {
  return (
    <Box
      as="hr"
      {...rest}
      sx={{
        bg: 'primaryText',
        border: 0,
        height: 1,
        ...sx,
      }}
      variant={`bar.${variant}`}
    />
  )
}

Bar.propTypes = {
  sx: PropTypes.object,
  variant: PropTypes.string,
}

Bar.defaultProps = {
  variant: 'normal',
}

export default Bar
