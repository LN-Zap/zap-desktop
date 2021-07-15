import React from 'react'

import { themeGet } from '@styled-system/theme-get'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass/styled-components'
import styled from 'styled-components'

import X from 'components/Icon/X'

const CloseButtonWrapper = styled(Box)`
  height: ${({ size }) => (size === 's' ? 32 : 40)}px;
  cursor: pointer;
  color: ${themeGet('colors.primaryText')};
  opacity: 0.6;
  &:hover {
    color: ${themeGet('colors.primaryAccent')};
  }
`

const CloseButton = ({ onClick, size, ...rest }) => {
  const actualSize = size === 's' ? 15 : 20
  return (
    <Flex justifyContent="flex-end" {...rest}>
      <CloseButtonWrapper onClick={onClick} p={2}>
        <X height={actualSize} width={actualSize} />
      </CloseButtonWrapper>
    </Flex>
  )
}

CloseButton.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['s', 'm']),
}

CloseButton.defaultProps = {
  size: 'm',
}

export default CloseButton
