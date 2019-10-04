import React from 'react'
import PropTypes from 'prop-types'
import { DataRow } from 'components/UI'
import { FieldLabelFactory } from 'components/Form'
import messages from './messages'
import PasswordState from './Security/PasswordState'

const FieldLabel = FieldLabelFactory(messages)

const SettingsFieldsSecurity = ({
  currentConfig,
  changePassword,
  enablePassword,
  disablePassword,
}) => {
  return (
    <DataRow
      left={<FieldLabel itemKey="password.active" tooltip="password_tooltip" />}
      right={
        <PasswordState
          onChange={changePassword}
          onDisable={disablePassword}
          onEnable={enablePassword}
          value={currentConfig.password.active}
        />
      }
    />
  )
}

SettingsFieldsSecurity.propTypes = {
  changePassword: PropTypes.func.isRequired,
  currentConfig: PropTypes.object.isRequired,
  disablePassword: PropTypes.func.isRequired,
  enablePassword: PropTypes.func.isRequired,
}

export default SettingsFieldsSecurity
