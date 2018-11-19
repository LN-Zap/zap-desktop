import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass'
import { Bar, Button, Heading } from 'components/UI'
import ArrowRight from 'components/Icon/ArrowRight'
import { WalletSettingsFormLocal, WalletSettingsFormRemote, WalletHeader } from '.'

class WalletLauncher extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    startLnd: PropTypes.func.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
    stopLnd: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }

  componentDidMount() {
    const { stopLnd } = this.props
    stopLnd()
  }

  /**
   * Redirect to the login page when we establish a connection to lnd.
   */
  componentDidUpdate(prevProps) {
    const { history, lightningGrpcActive, walletUnlockerGrpcActive, wallet } = this.props

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

  walletName = wallet => {
    if (wallet.type === 'local') {
      return wallet.alias || `Wallet #${wallet.id}`
    }
    return wallet.host.split(':')[0]
  }

  handleDelete = () => {
    const { deleteWallet, wallet } = this.props
    deleteWallet(wallet.id)
  }

  render() {
    const { startLnd, wallet } = this.props
    const walletName = this.walletName(wallet)

    return (
      <React.Fragment>
        <Flex mb={4} alignItems="center">
          <WalletHeader title={walletName} />

          <Box ml="auto">
            <Button type="button" size="small" onClick={this.handleDelete} mr={2}>
              delete
            </Button>
            <Button
              type="submit"
              size="small"
              variant="primary"
              form={`wallet-settings-form-${wallet.id}`}
            >
              <Flex>
                <Box mr={1}>Launch now</Box>
                <Box>
                  <ArrowRight />
                </Box>
              </Flex>
            </Button>
          </Box>
        </Flex>

        {wallet.type === 'local' && (
          <>
            <Heading.h2 mb={4}>Settings</Heading.h2>
            <Bar my={2} />
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
      </React.Fragment>
    )
  }
}

export default withRouter(WalletLauncher)
