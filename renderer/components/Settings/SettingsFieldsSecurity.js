import React from 'react'
import PropTypes from 'prop-types'
import { DataRow } from 'components/UI'
import { FieldLabelFactory } from 'components/Form'
import messages from './messages'
import PasswordState from './Security/PasswordState'

const FieldLabel = FieldLabelFactory(messages)

const SettingsFieldsSecurity = ({
  changePassword,
  enablePassword,
  disablePassword,
  isAccountPasswordEnabled,
}) => {
  return (
    <DataRow
      left={<FieldLabel itemKey="password.active" tooltip="password_tooltip" />}
      right={
        <PasswordState
          isActive={isAccountPasswordEnabled}
          onChange={changePassword}
          onDisable={disablePassword}
          onEnable={enablePassword}
        />
      }
    />
  )
}

SettingsFieldsSecurity.propTypes = {
  changePassword: PropTypes.func.isRequired,
  disablePassword: PropTypes.func.isRequired,
  enablePassword: PropTypes.func.isRequired,
  isAccountPasswordEnabled: PropTypes.bool,
}

export default SettingsFieldsSecurity
