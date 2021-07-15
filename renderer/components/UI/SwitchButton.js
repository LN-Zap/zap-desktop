import React from 'react'

import { themeGet } from '@styled-system/theme-get'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Button from 'components/UI/Button'

const StyledButton = styled(Button)`
  &:hover {
    color: ${themeGet('colors.primaryAccent')};
  }
`

const IconButton = ({ isSwitched, onClick, Icon1, Icon2, ...rest }) => {
  const Icon = isSwitched ? Icon1 : Icon2
  return (
    <StyledButton
      active={isSwitched}
      alignSelf="center"
      className="hint--bottom-left"
      onClick={onClick}
      size="small"
      variant="secondary"
      {...rest}
    >
      <Icon height="16px" width="16px" />
    </StyledButton>
  )
}

IconButton.propTypes = {
  Icon1: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  Icon2: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  isSwitched: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

const SwitchButton = ({ isSwitched, onClick, ...rest }) => (
  <IconButton {...rest} isSwitched={isSwitched} onClick={onClick} px={2} />
)

SwitchButton.propTypes = {
  isSwitched: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default SwitchButton
