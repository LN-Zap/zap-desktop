import React from 'react'

import PropTypes from 'prop-types'

import { FieldLabelFactory, Toggle } from 'components/Form'
import { DataRow } from 'components/UI'

import messages from './messages'
import PasswordState from './Security/PasswordState'

const FieldLabel = FieldLabelFactory(messages)

const SettingsFieldsSecurity = ({
  currentConfig,
  changePassword,
  enablePassword,
  disablePassword,
  isAccountPasswordEnabled,
}) => {
  return (
    <>
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
      <DataRow
        left={<FieldLabel itemKey="lnurl.withdraw" />}
        right={
          <Toggle field="lnurl.requirePrompt" initialValue={currentConfig.lnurl.requirePrompt} />
        }
      />
    </>
  )
}

SettingsFieldsSecurity.propTypes = {
  changePassword: PropTypes.func.isRequired,
  currentConfig: PropTypes.object.isRequired,
  disablePassword: PropTypes.func.isRequired,
  enablePassword: PropTypes.func.isRequired,
  isAccountPasswordEnabled: PropTypes.bool,
}

export default SettingsFieldsSecurity
