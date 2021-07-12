import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Form, PasswordInput } from 'components/Form'
import { Bar, Header } from 'components/UI'

import messages from './messages'

class Password extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    setPassword: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  handleSubmit = async values => {
    const { setPassword } = this.props
    await setPassword(values.password)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, intl, ...rest } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState

    return (
      <Form
        {...rest}
        getApi={formApi => {
          this.setFormApi(formApi)
          if (getApi) {
            getApi(formApi)
          }
        }}
        onChange={onChange && (formState => onChange(formState, currentItem))}
        onSubmit={async values => {
          await this.handleSubmit(values)
          if (onSubmit) {
            onSubmit(values)
          }
        }}
        onSubmitFailure={onSubmitFailure}
      >
        {({ formState }) => {
          const willValidateInline = formState.submits > 0

          const validatePassword = confirmPassword => {
            const { password } = formState.values
            if (password !== confirmPassword) {
              return intl.formatMessage({ ...messages.password_error_match })
            }
            return undefined
          }

          return (
            <>
              <Header
                subtitle={<FormattedMessage {...messages.create_wallet_password_description} />}
                title={<FormattedMessage {...messages.create_wallet_password_title} />}
              />

              <Bar my={4} />

              <Box>
                <PasswordInput
                  autoComplete="new-password"
                  field="password"
                  hasMessageSpacer
                  isRequired
                  label={<FormattedMessage {...messages.password_label} />}
                  mb={3}
                  minLength={8}
                  placeholder={intl.formatMessage({ ...messages.password_placeholder })}
                  validateOnBlur={willValidateInline}
                  validateOnChange={willValidateInline}
                  willAutoFocus
                />
                <PasswordInput
                  autoComplete="new-password"
                  field="confirmPassword"
                  hasMessageSpacer
                  isRequired
                  label={<FormattedMessage {...messages.password_confirm_label} />}
                  minLength={8}
                  placeholder={intl.formatMessage({ ...messages.password_confirm_placeholder })}
                  validate={validatePassword}
                  validateOnBlur={willValidateInline}
                  validateOnChange={willValidateInline}
                />
              </Box>
            </>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(Password)
