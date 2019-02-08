import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Button, Form, PasswordInput } from 'components/UI'
import * as yup from 'yup'
import { WalletHeader } from '.'
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
    wallet: PropTypes.object.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }),
    unlockingWallet: PropTypes.bool,
    unlockWalletError: PropTypes.string,
    unlockWallet: PropTypes.func.isRequired,
    setUnlockWalletError: PropTypes.func.isRequired
  }

  componentDidUpdate(prevProps) {
    const {
      wallet,
      lightningGrpcActive,
      history,
      setUnlockWalletError,
      unlockingWallet,
      unlockWalletError
    } = this.props

    // Set the form error if we got an error unlocking.
    if (unlockWalletError && !prevProps.unlockWalletError) {
      this.formApi.setError('password', unlockWalletError)
      setUnlockWalletError(null)
    }

    // Redirect to the app if the wallet was successfully unlocked.
    if (!unlockingWallet && prevProps.unlockingWallet && !unlockWalletError) {
      if (wallet.type === 'local') {
        history.push('/syncing')
      } else {
        history.push('/app')
      }
    }

    // If an active wallet connection has been established, switch to the app.
    if (lightningGrpcActive && !prevProps.lightningGrpcActive) {
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
    const { intl, unlockingWallet, wallet } = this.props

    return (
      <Form
        width={1}
        getApi={this.setFormApi}
        onSubmit={this.onSubmit}
        onSubmitFailure={this.onSubmitFailure}
        key={`wallet-unlocker-form-${wallet.id}`}
        mt={72}
      >
        {({ formState }) => (
          <React.Fragment>
            <WalletHeader wallet={wallet} />

            <PasswordInput
              autoFocus
              field="password"
              id="password"
              label={<FormattedMessage {...messages.wallet_unlocker_password_label} />}
              placeholder={intl.formatMessage({ ...messages.wallet_unlocker_password_placeholder })}
              my={3}
              validate={this.validatePassword}
              validateOnBlur
              validateOnChange={formState.invalid}
            />

            <Button type="submit" disabled={unlockingWallet} processing={unlockingWallet}>
              <FormattedMessage {...messages.wallet_unlocker_button_label} />
            </Button>
          </React.Fragment>
        )}
      </Form>
    )
  }
}

export default withRouter(injectIntl(WalletUnlocker))
