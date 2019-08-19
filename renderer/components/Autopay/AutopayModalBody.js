import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass/styled-components'
import { Card, CloseButton } from 'components/UI'
import Autopay from 'components/Icon/Autopay'

const AutopayModalBody = ({ children, onClose }) => (
  <Box
    css={`
      position: relative;
    `}
  >
    <CloseButton
      css={`
        position: absolute;
        right: 0;
      `}
      m={3}
      onClick={onClose}
      size="s"
    />
    <Card borderRadius={40} width={640}>
      <Box mt={2} p={2}>
        {children}
      </Box>
    </Card>
    <Flex
      css={`
        position: absolute;
        top: -25px;
      `}
      justifyContent="center"
      width={1}
    >
      <Autopay height={50} mt="-102px" width={50} />
    </Flex>
  </Box>
)

AutopayModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default AutopayModalBody
