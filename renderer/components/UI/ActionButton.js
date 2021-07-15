import React, { useState, useEffect, useRef, useCallback } from 'react'

import { themeGet } from '@styled-system/theme-get'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import delay from '@zap/utils/delay'

import Button from './Button'
import Spinner from './Spinner'

const StyledButton = styled(Button)`
  color: ${props => (props.active ? themeGet('colors.primaryAccent') : null)};
  &:hover {
    color: ${themeGet('colors.primaryAccent')};
  }
`
StyledButton.propTypes = {
  active: PropTypes.bool,
}

const ActionButton = ({ children, hint, isLoading, onClick, timeout = 1000, ...rest }) => {
  const [status, setStatus] = useState(null)
  const buttonRef = useRef()

  const triggerAction = useCallback(async () => {
    await onClick()
    await delay(timeout)
    setStatus('done')
  }, [onClick, timeout])

  useEffect(() => {
    if (status === 'fetching') {
      triggerAction()
    } else if (status === 'done') {
      buttonRef.current.blur()
    }
  }, [status, triggerAction])

  const handleClick = () => {
    setStatus('fetching')
  }

  return (
    <StyledButton
      active={status === 'fetching'}
      className="hint--bottom-left"
      data-hint={hint}
      onClick={handleClick}
      ref={buttonRef}
      size="small"
      variant="secondary"
      {...rest}
    >
      {status === 'fetching' || isLoading ? <Spinner height="16px" width="16px" /> : children}
    </StyledButton>
  )
}

ActionButton.propTypes = {
  children: PropTypes.node,
  hint: PropTypes.node,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  timeout: PropTypes.number,
}

export default ActionButton
