import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Bar, Form, Header, PasswordInput } from 'components/UI'
import messages from './messages'

class Login extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    walletDir: PropTypes.string.isRequired,
    unlockWalletError: PropTypes.string,
    setUnlockWalletError: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    unlockWalletError: null
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
    const {
      wizardApi,
      wizardState,
      walletDir,
      unlockWallet,
      unlockWalletError,
      setUnlockWalletError,
      intl,
      ...rest
    } = this.props
    const { getApi, onChange, preSubmit, onSubmit, onSubmitFailure } = wizardApi
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
        preSubmit={preSubmit}
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
          const shouldValidateInline = formState.submits > 0
          return (
            <>
              <Header
                title={<FormattedMessage {...messages.login_title} />}
                subtitle={<FormattedMessage {...messages.login_description} />}
                align="left"
              />

              <Bar my={4} />

              <Box>
                <PasswordInput
                  field="password"
                  name="password"
                  label={<FormattedMessage {...messages.password_label} />}
                  description={<FormattedMessage {...messages.password_description} />}
                  required
                  validateOnBlur={shouldValidateInline}
                  validateOnChange={shouldValidateInline}
                  placeholder={intl.formatMessage({ ...messages.password_placeholder })}
                  autoComplete="current-password"
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
