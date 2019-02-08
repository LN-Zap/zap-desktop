import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass'
import { Bar, Button, Heading, Text } from 'components/UI'
import { WalletSettingsFormLocal, WalletSettingsFormRemote, WalletHeader } from '.'
import messages from './messages'

class WalletLauncher extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    startLnd: PropTypes.func.isRequired,
    startingLnd: PropTypes.bool.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
    startLndError: PropTypes.object,
    setStartLndError: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    stopLnd: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }

  componentDidMount() {
    const { stopLnd, startLndError, showError, setStartLndError } = this.props
    stopLnd()

    // If there are lnd start errors, show as a global error.
    if (startLndError) {
      Object.keys(startLndError).forEach(key => showError(startLndError[key]))
      setStartLndError(null)
    }
  }

  /**
   * Redirect to the login page when we establish a connection to lnd.
   */
  componentDidUpdate(prevProps) {
    const {
      history,
      lightningGrpcActive,
      walletUnlockerGrpcActive,
      startLndError,
      showError,
      setStartLndError,
      wallet
    } = this.props

    // If we got lnd start errors, show as a global error.
    if (startLndError && !prevProps.startLndError) {
      Object.keys(startLndError).forEach(key => showError(startLndError[key]))
      setStartLndError(null)
    }

    // If the wallet unlocker became active, switch to the login screen
    if (walletUnlockerGrpcActive && !prevProps.walletUnlockerGrpcActive) {
      history.push(`/home/wallet/${wallet.id}/unlock`)
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

  handleDelete = () => {
    const { deleteWallet, wallet } = this.props
    deleteWallet(wallet.id)
  }

  render() {
    const { startLnd, startingLnd, wallet } = this.props

    return (
      <Box>
        <Flex mb={4} alignItems="center">
          <Box width="75%" mr={3}>
            <WalletHeader wallet={wallet} />
          </Box>
          <Flex ml="auto" justifyContent="flex-end" flexDirection="column">
            <Button
              type="submit"
              size="small"
              disabled={startingLnd}
              processing={startingLnd}
              form={`wallet-settings-form-${wallet.id}`}
              ml={2}
            >
              <FormattedMessage {...messages.launch_wallet_button_text} />
            </Button>
          </Flex>
        </Flex>

        {wallet.type === 'local' && (
          <>
            <Heading.h1 mb={5}>
              <FormattedMessage {...messages.settings_title} />
            </Heading.h1>

            <WalletSettingsFormLocal
              key={wallet.id}
              id={`wallet-settings-form-${wallet.id}`}
              wallet={wallet}
              startLnd={startLnd}
            />
          </>
        )}

        {wallet.type !== 'local' && (
          <>
            <WalletSettingsFormRemote
              key={wallet.id}
              id={`wallet-settings-form-${wallet.id}`}
              wallet={wallet}
              startLnd={startLnd}
            />
          </>
        )}

        <Text mt={4} fontWeight="normal">
          <FormattedMessage {...messages.section_delete_title} />
        </Text>
        <Bar my={2} />

        <Flex justifyContent="center" my={4}>
          <Button size="small" onClick={this.handleDelete}>
            <FormattedMessage {...messages.delete_wallet_button_text} />
          </Button>
        </Flex>
      </Box>
    )
  }
}

export default withRouter(WalletLauncher)
