import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Form, PasswordInput } from 'components/Form'
import { Bar, Header } from 'components/UI'

import messages from './messages'

class Login extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    setUnlockWalletError: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired,
    unlockWalletError: PropTypes.string,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    unlockWalletError: null,
  }

  componentDidUpdate(prevProps) {
    const { setUnlockWalletError, unlockWalletError } = this.props
    // Set the form error if we got an error unlocking.
    if (unlockWalletError && !prevProps.unlockWalletError) {
      this.formApi.setError('password', unlockWalletError)
      setUnlockWalletError(null)
    }
  }

  handleSubmit = async values => {
    const { unlockWallet } = this.props
    await unlockWallet(values.password)
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
          try {
            await this.handleSubmit(values)
            if (onSubmit) {
              onSubmit(values)
            }
          } catch (e) {
            wizardApi.onSubmitFailure()
          }
        }}
        onSubmitFailure={onSubmitFailure}
      >
        {({ formState }) => {
          const willValidateInline = formState.submits > 0
          return (
            <>
              <Header
                subtitle={<FormattedMessage {...messages.login_description} />}
                title={<FormattedMessage {...messages.login_title} />}
              />

              <Bar my={4} />

              <Box>
                <PasswordInput
                  autoComplete="current-password"
                  description={<FormattedMessage {...messages.password_description} />}
                  field="password"
                  isRequired
                  label={<FormattedMessage {...messages.password_label} />}
                  minLength={8}
                  placeholder={intl.formatMessage({ ...messages.password_placeholder })}
                  validateOnBlur={willValidateInline}
                  validateOnChange={willValidateInline}
                  willAutoFocus
                />
              </Box>
            </>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(Login)
