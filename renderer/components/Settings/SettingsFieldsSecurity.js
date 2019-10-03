import React from 'react'
import PropTypes from 'prop-types'
import { useFieldState, useFormState } from 'informed'
import { useIntl } from 'react-intl'
import { DataRow } from 'components/UI'
import { PasswordInput, FieldLabelFactory, Toggle } from 'components/Form'
import messages from './messages'

const FieldLabel = FieldLabelFactory(messages)

const SettingsFieldsSecurity = ({ currentConfig }) => {
  const { value: isPasswordActive } = useFieldState('password.active')
  const { submits } = useFormState()
  const willValidateInline = submits > 0
  const intl = useIntl()

  return (
    <>
      <DataRow
        left={<FieldLabel itemKey="password.active" tooltip="password_tooltip" />}
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
              validateOnBlur={willValidateInline}
              validateOnChange={willValidateInline}
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
