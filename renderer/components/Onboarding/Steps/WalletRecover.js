import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import { Bar, Form, Header, Message, PasswordInput, Spinner, Text } from 'components/UI'
import messages from './messages'

const isInvalidPassphrase = error => error === 'invalid passphrase'

class WalletRecover extends React.Component {
  static propTypes = {
    clearWalletRecoveryError: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    isRecoveringWallet: PropTypes.bool,
    passphrase: PropTypes.string,
    recoverOldWallet: PropTypes.func.isRequired,
    setPassphrase: PropTypes.func.isRequired,
    walletRecoveryError: PropTypes.string,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  componentDidMount() {
    const { wizardApi } = this.props
    wizardApi.next()
  }

  componentDidUpdate(prevProps) {
    const { isRecoveringWallet, walletRecoveryError } = this.props

    // Handle success case.
    if (!walletRecoveryError && !isRecoveringWallet && prevProps.isRecoveringWallet) {
      this.handleSuccess()
    }

    // Handle failure case.
    if (walletRecoveryError && !isRecoveringWallet && prevProps.isRecoveringWallet) {
      this.handleError()
    }
  }

  componentWillUnmount() {
    const { clearWalletRecoveryError } = this.props
    clearWalletRecoveryError()
  }

  handleSubmit = values => {
    const { recoverOldWallet, setPassphrase } = this.props
    const { passphrase } = values
    if (passphrase) {
      setPassphrase(passphrase)
    }
    recoverOldWallet()
  }

  handleSuccess = () => {
    const { wizardApi } = this.props
    wizardApi.onSubmit()
  }

  handleError = () => {
    const { passphrase, wizardApi, walletRecoveryError } = this.props
    wizardApi.onSubmitFailure()

    // If the user entered an incorrect passphrase, set the error on the passphrase form element.
    if (passphrase && walletRecoveryError && isInvalidPassphrase(walletRecoveryError)) {
      this.formApi.setError('passphrase', walletRecoveryError)
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const {
      wizardApi,
      wizardState,
      passphrase,
      recoverOldWallet,
      setPassphrase,
      clearWalletRecoveryError,
      isRecoveringWallet,
      walletRecoveryError,
      intl,
      ...rest
    } = this.props
    const { getApi, onChange, onSubmitFailure } = wizardApi
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
                align="left"
                subtitle={<FormattedMessage {...messages.importing_wallet_subtitle} />}
                title={<FormattedMessage {...messages.importing_wallet_title} />}
              />

              <Bar my={4} />

              {isRecoveringWallet && (
                <Text textAlign="center">
                  <Spinner />
                  <FormattedMessage {...messages.importing_wallet} />
                </Text>
              )}

              {!isRecoveringWallet && walletRecoveryError && (
                <>
                  {isInvalidPassphrase(walletRecoveryError) ? (
                    <PasswordInput
                      autoComplete="current-password"
                      description={intl.formatMessage({ ...messages.passphrase_description })}
                      field="passphrase"
                      isRequired
                      label={<FormattedMessage {...messages.passphrase_label} />}
                      name="passphrase"
                      placeholder={intl.formatMessage({ ...messages.passphrase_placeholder })}
                      validateOnBlur={shouldValidateInline}
                      validateOnChange={shouldValidateInline}
                      willAutoFocus
                    />
                  ) : (
                    <Message variant="error">{walletRecoveryError}</Message>
                  )}
                </>
              )}
            </>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(WalletRecover)
