import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'

import { intlShape } from '@zap/i18n'
import { Form, PasswordInput } from 'components/Form'
import { Button } from 'components/UI'

import messages from './messages'
import WalletHeader from './WalletHeader'

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
    staticContext: PropTypes.object,
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
      unlockWalletError,
    } = this.props

    // Set the form error if we got an error unlocking.
    if (unlockWalletError && !prevProps.unlockWalletError) {
      this.formApi.setError('password', unlockWalletError)
      setUnlockWalletError(null)
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

  render = () => {
    const { intl, isUnlockingWallet, wallet, ...rest } = this.props
    return (
      <Form
        getApi={this.setFormApi}
        key={`wallet-unlocker-form-${wallet.id}`}
        onSubmit={this.onSubmit}
        {...rest}
      >
        {({ formState }) => (
          <>
            <WalletHeader wallet={wallet} />

            <PasswordInput
              autoComplete="current-password"
              field="password"
              isRequired
              label={<FormattedMessage {...messages.wallet_unlocker_password_label} />}
              minLength={8}
              my={3}
              placeholder={intl.formatMessage({ ...messages.wallet_unlocker_password_placeholder })}
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
