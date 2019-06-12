import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import { Box, Card, Flex } from 'rebass'
import Button from 'components/UI/Button'
import ClippedText from 'components/UI/ClippedText'
import Copy from 'components/Icon/Copy'

const CopyBox = ({ value, hint, onCopy, ...rest }) => {
  const doCopy = () => {
    copy(value)
    if (onCopy) {
      onCopy(value)
    }
  }

  return (
    <Card bg="tertiaryColor" borderRadius={5} p={0} {...rest}>
      <Flex justifyContent="space-between">
        <ClippedText fontSize="s" p={3} textAlign="center" width={1}>
          {value}
        </ClippedText>
        <Button
          className="hint--left"
          data-hint={hint}
          onClick={doCopy}
          px={0}
          py={0}
          variant="secondary"
        >
          <Box bg="primaryColor" p={3} width={1}>
            <Copy />
          </Box>
        </Button>
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
