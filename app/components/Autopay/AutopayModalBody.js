import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass'
import { Card } from 'components/UI'
import Autopay from 'components/Icon/Autopay'
import X from 'components/Icon/X'

const CloseButton = ({ onClick }) => (
  <Flex color="primaryText" justifyContent="space-between">
    <Box
      css={{
        position: 'absolute',
        right: 0,
        height: '32px',
        cursor: 'pointer',
        opacity: 0.6,
        '&:hover': { opacity: 1 },
      }}
      m={3}
      ml="auto"
      onClick={onClick}
      p={2}
    >
      <X height={15} width={15} />
    </Box>
  </Flex>
)

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

const AutopayModalBody = ({ children, onClose }) => (
  <Box css={{ position: 'relative' }}>
    <CloseButton onClick={onClose} />
    <Card borderRadius={40} width={640}>
      <Box mt={2} p={2}>
        {children}
      </Box>
    </Card>
    <Flex css={{ position: 'absolute', top: '-25px' }} justifyContent="center" width={1}>
      <Autopay height={50} mt="-102px" width={50} />
    </Flex>
  </Box>
)

AutopayModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default AutopayModalBody
