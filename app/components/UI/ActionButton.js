import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import delay from 'lib/utils/delay'
import Button from './Button'
import Spinner from './Spinner'

const StyledButton = styled(Button)`
  color: ${props => (props.active ? props.theme.colors.lightningOrange : null)};
  &:hover {
    color: ${props => props.theme.colors.lightningOrange};
  }
`
StyledButton.propTypes = {
  active: PropTypes.bool,
}

const ActionButton = ({ children, hint, onClick, timeout, ...rest }) => {
  const [status, setStatus] = useState(null)
  const buttonRef = useRef()

  async function triggerAction() {
    await onClick()
    await delay(timeout)
    setStatus('done')
  }

  useEffect(() => {
    if (status === 'fetching') {
      triggerAction()
    } else if (status === 'done') {
      buttonRef.current.blur()
    }
  }, [status])

  function handleClick() {
    setStatus('fetching')
  }

  return (
    <StyledButton
      ref={buttonRef}
      active={status === 'fetching'}
      className="hint--bottom-left"
      data-hint={hint}
      onClick={handleClick}
      size="small"
      variant="secondary"
      {...rest}
    >
      {status === 'fetching' ? <Spinner /> : children}
    </StyledButton>
  )
}

ActionButton.propTypes = {
  children: PropTypes.node,
  hint: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  timeout: PropTypes.number,
}

ActionButton.defaultProps = {
  timeout: 1000,
}

export default ActionButton
