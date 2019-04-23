import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import { Bar, Form, Header, Message, PasswordInput, Spinner, Text } from 'components/UI'
import messages from './messages'

const isInvalidPassphrase = error => error === 'invalid passphrase'

class WalletRecover extends React.Component {
  static propTypes = {
    clearCreateWalletError: PropTypes.func.isRequired,
    createWallet: PropTypes.func.isRequired,
    createWalletError: PropTypes.string,
    intl: intlShape.isRequired,
    isCreatingWallet: PropTypes.bool,
    passphrase: PropTypes.string,
    setPassphrase: PropTypes.func.isRequired,
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
    const { isCreatingWallet, createWalletError } = this.props

    // Handle success case.
    if (!createWalletError && !isCreatingWallet && prevProps.isCreatingWallet) {
      this.handleSuccess()
    }

    // Handle failure case.
    if (createWalletError && !isCreatingWallet && prevProps.isCreatingWallet) {
      this.handleError()
    }
  }

  componentWillUnmount() {
    const { clearCreateWalletError } = this.props
    clearCreateWalletError()
  }

  handleSubmit = values => {
    const { createWallet, setPassphrase } = this.props
    const { passphrase } = values
    if (passphrase) {
      setPassphrase(passphrase)
    }
    createWallet({ recover: true })
  }

  handleSuccess = () => {
    const { wizardApi } = this.props
    wizardApi.onSubmit()
  }

  handleError = () => {
    const { passphrase, wizardApi, createWalletError } = this.props
    wizardApi.onSubmitFailure()

    // If the user entered an incorrect passphrase, set the error on the passphrase form element.
    if (passphrase && createWalletError && isInvalidPassphrase(createWalletError)) {
      this.formApi.setError('passphrase', createWalletError)
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
      createWallet,
      setPassphrase,
      clearCreateWalletError,
      isCreatingWallet,
      createWalletError,
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
        onSubmit={this.handleSubmit}
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

              {isCreatingWallet && (
                <Text textAlign="center">
                  <Spinner />
                  <FormattedMessage {...messages.importing_wallet} />
                </Text>
              )}

              {!isCreatingWallet && createWalletError && (
                <>
                  {isInvalidPassphrase(createWalletError) ? (
                    <PasswordInput
                      autoComplete="current-password"
                      description={intl.formatMessage({ ...messages.passphrase_description })}
                      field="passphrase"
                      isRequired
                      label={<FormattedMessage {...messages.passphrase_label} />}
                      minLength={1}
                      name="passphrase"
                      placeholder={intl.formatMessage({ ...messages.passphrase_placeholder })}
                      validateOnBlur={shouldValidateInline}
                      validateOnChange={shouldValidateInline}
                      willAutoFocus
                    />
                  ) : (
                    <Message variant="error">{createWalletError}</Message>
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
