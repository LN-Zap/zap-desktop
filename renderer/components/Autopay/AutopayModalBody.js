import React from 'react'

import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass/styled-components'

import Autopay from 'components/Icon/Autopay'
import { Card, CloseButton } from 'components/UI'

const AutopayModalBody = ({ children, onClose }) => (
  <Box sx={{ position: 'relative' }}>
    <CloseButton m={3} onClick={onClose} size="s" sx={{ position: 'absolute', right: 0 }} />
    <Card sx={{ borderRadius: 'xl' }} width={640}>
      <Box mt={2} p={2}>
        {children}
      </Box>
    </Card>
    <Flex justifyContent="center" sx={{ position: 'absolute', top: -25 }} width={1}>
      <Autopay height={50} mt="-102px" width={50} />
    </Flex>
  </Box>
)

AutopayModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default AutopayModalBody
