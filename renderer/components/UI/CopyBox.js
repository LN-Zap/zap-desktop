import React from 'react'

import PropTypes from 'prop-types'
import { Box, Card, Flex } from 'rebass/styled-components'

import ClippedText from './ClippedText'
import CopyButton from './CopyButton'

const CopyBox = ({ value, hint, onCopy, ...rest }) => {
  return (
    <Card bg="tertiaryColor" p={0} sx={{ borderRadius: 's' }} {...rest}>
      <Flex justifyContent="space-between">
        <ClippedText fontSize="s" p={3} textAlign="center" width={1}>
          {value}
        </ClippedText>
        <Box bg="primaryColor">
          <CopyButton hint={hint} onCopy={onCopy} p={3} value={value} />
        </Box>
      </Flex>
    </Card>
  )
}

CopyBox.propTypes = {
  hint: PropTypes.node,
  onCopy: PropTypes.func,
  value: PropTypes.string,
}

export default CopyBox
