import React from 'react'
import PropTypes from 'prop-types'
import { useFieldState, useFormState } from 'informed'
import { useIntl } from 'react-intl'
import { DataRow } from 'components/UI'
import { PasswordInput, Toggle } from 'components/Form'
import { FieldLabel } from './SettingsFieldHelpers'
import messages from './messages'

const SettingsFieldsSecurity = ({ currentConfig }) => {
  const { value: isPasswordActive } = useFieldState('password.active')
  const { submits } = useFormState()
  const shouldValidateInline = submits > 0
  const intl = useIntl()

  return (
    <>
      <DataRow
        left={<FieldLabel itemKey="password.active" />}
        pb={0}
        right={<Toggle field="password.active" initialValue={currentConfig.password.active} />}
      />
      {isPasswordActive && (
        <DataRow
          pt={0}
          right={
            <PasswordInput
              description={intl.formatMessage({ ...messages.password_value_description })}
              field="password.value"
              initialValue={currentConfig.password.value}
              isRequired
              minLength={6}
              validateOnBlur={shouldValidateInline}
              validateOnChange={shouldValidateInline}
              width={200}
            />
          }
        />
      )}
    </>
  )
}

SettingsFieldsSecurity.propTypes = {
  currentConfig: PropTypes.object.isRequired,
}

export default SettingsFieldsSecurity
