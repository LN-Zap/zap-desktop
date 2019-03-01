import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import styled from 'styled-components'
import delay from 'lib/utils/delay'
import { Button, Spinner } from 'components/UI'
import Sync from 'components/Icon/Sync'
import messages from './messages'

const StyledButton = styled(Button)`
  color: ${props => (props.active ? props.theme.colors.lightningOrange : null)};
  &:hover {
    color: ${props => props.theme.colors.lightningOrange};
  }
`
StyledButton.propTypes = {
  active: PropTypes.bool
}

const ActivityRefresh = injectIntl(({ intl, onClick, ...rest }) => {
  const [status, setStatus] = useState(null)
  const buttonRef = useRef()

  async function fetchActivity() {
    await onClick()
    await delay(1000)
    setStatus('done')
  }

  useEffect(() => {
    if (status === 'fetching') {
      fetchActivity()
    }
  }, [status])

  useEffect(() => {
    if (status === 'done') {
      buttonRef.current.blur()
    }
  }, [status])

  function handleClick() {
    setStatus('fetching')
  }

  return (
    <StyledButton
      variant="secondary"
      size="small"
      active={status === 'fetching'}
      onClick={handleClick}
      ref={buttonRef}
      className="hint--bottom-left"
      data-hint={intl.formatMessage({ ...messages.refresh_button_hint })}
      {...rest}
    >
      {status === 'fetching' ? <Spinner /> : <Sync height="16px" width="16px" />}
    </StyledButton>
  )
})

ActivityRefresh.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default ActivityRefresh
