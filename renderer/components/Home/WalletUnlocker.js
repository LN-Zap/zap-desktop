import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Button, Form, PasswordInput } from 'components/UI'
import * as yup from 'yup'
import WalletHeader from './WalletHeader'
import messages from './messages'
/**
 * @render react
 * @name WalletUnlocker
 * @example
 * <WalletUnlocker
     wallet={{ ... }}
     unlockWallet={() => {}}>
 */
class WalletUnlocker extends React.Component {
  static displayName = 'WalletUnlocker'

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    intl: intlShape.isRequired,
    isLightningGrpcActive: PropTypes.bool.isRequired,
    isUnlockingWallet: PropTypes.bool,
    setUnlockWalletError: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired,
    unlockWalletError: PropTypes.string,
    wallet: PropTypes.object.isRequired,
  }

  componentDidUpdate(prevProps) {
    const {
      wallet,
      isLightningGrpcActive,
      history,
      setUnlockWalletError,
      isUnlockingWallet,
      unlockWalletError,
    } = this.props

    // Set the form error if we got an error unlocking.
    if (unlockWalletError && !prevProps.unlockWalletError) {
      this.formApi.setError('password', unlockWalletError)
      setUnlockWalletError(null)
    }

    // Redirect to the app if the wallet was successfully unlocked.
    if (!isUnlockingWallet && prevProps.isUnlockingWallet && !unlockWalletError) {
      if (wallet.type === 'local') {
        history.push('/syncing')
      } else {
        history.push('/app')
      }
    }

    // If an active wallet connection has been established, switch to the app.
    if (isLightningGrpcActive && !prevProps.isLightningGrpcActive) {
      if (wallet.type === 'local') {
        history.push('/syncing')
      } else {
        history.push('/app')
      }
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  onSubmit = values => {
    const { unlockWallet } = this.props
    unlockWallet(values.password)
  }

  validatePassword = value => {
    try {
      yup
        .string()
        .required()
        .min(8)
        .validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  render = () => {
    const { intl, isUnlockingWallet, wallet } = this.props

    return (
      <Form
        key={`wallet-unlocker-form-${wallet.id}`}
        getApi={this.setFormApi}
        onSubmit={this.onSubmit}
        onSubmitFailure={this.onSubmitFailure}
        pb={6}
        pt={4}
        px={5}
        width={1}
      >
        {({ formState }) => (
          <>
            <WalletHeader wallet={wallet} />

            <PasswordInput
              field="password"
              id="password"
              label={<FormattedMessage {...messages.wallet_unlocker_password_label} />}
              my={3}
              placeholder={intl.formatMessage({ ...messages.wallet_unlocker_password_placeholder })}
              validate={this.validatePassword}
              validateOnBlur
              validateOnChange={formState.invalid}
              willAutoFocus
            />

            <Button isDisabled={isUnlockingWallet} isProcessing={isUnlockingWallet} type="submit">
              <FormattedMessage {...messages.wallet_unlocker_button_label} />
            </Button>
          </>
        )}
      </Form>
    )
  }
}

export default withRouter(injectIntl(WalletUnlocker))
