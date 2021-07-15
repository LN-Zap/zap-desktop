import React from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

const Page = ({ sx, ...rest }) => {
  return (
    <Flex
      as="article"
      bg="primaryColor"
      color="primaryText"
      height="100%"
      minHeight="425px"
      minWidth="900px"
      {...rest}
      sx={{
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'l',
        ...sx,
      }}
    />
  )
}

Page.propTypes = {
  sx: PropTypes.object,
}

export default Page
