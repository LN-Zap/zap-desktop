import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themeGet } from 'styled-system'
import { Flex } from 'rebass'
import X from 'components/Icon/X'

const CloseButtonWrapper = styled(Flex)`
  height: ${({ size }) => (size === 's' ? 32 : 40)}px;
  cursor: pointer;
  opacity: 0.6;
  &:hover {
    color: ${themeGet('colors.lightningOrange')};
  }
`

const CloseButton = ({ onClick, size, ...rest }) => {
  const actualSize = size === 's' ? 15 : 20
  return (
    <CloseButtonWrapper justifyContent="flex-end" onClick={onClick} p={2} {...rest}>
      <X height={actualSize} width={actualSize} />
    </CloseButtonWrapper>
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
