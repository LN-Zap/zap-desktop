import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { Button } from 'components/UI'

import messages from './messages'

const PasswordState = ({ isActive, onDisable, onChange, onEnable, ...props }) => {
  return (
    <Flex {...props}>
      {isActive ? (
        <>
          <Button onClick={onChange} size="small" type="button" variant="secondary">
            <FormattedMessage {...messages.password_change_button_text} />
          </Button>
          <Button ml={3} onClick={onDisable} size="small" type="button" variant="secondary">
            <FormattedMessage {...messages.password_disable_button_text} />
          </Button>
        </>
      ) : (
        <Button onClick={onEnable} size="small" type="button" variant="secondary">
          <FormattedMessage {...messages.password_enable_button_text} />
        </Button>
      )}
    </Flex>
  )
}

PasswordState.propTypes = {
  isActive: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onDisable: PropTypes.func.isRequired,
  onEnable: PropTypes.func.isRequired,
}

export default PasswordState
