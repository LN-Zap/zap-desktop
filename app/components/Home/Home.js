import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Box } from 'rebass'
import { Bar, Heading, MainContent, Sidebar } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'
import { CreateWalletButton, WalletLauncher, WalletsMenu, WalletUnlocker } from '.'

const NoMatch = () => (
  <Box>
    <Heading>Please select a wallet</Heading>
  </Box>
)

class Home extends React.Component {
  static propTypes = {
    activeWallet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    deleteWallet: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
    wallets: PropTypes.array.isRequired,
    startLnd: PropTypes.func.isRequired,
    stopLnd: PropTypes.func.isRequired,
    setActiveWallet: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired,
    setUnlockWalletError: PropTypes.func.isRequired,
    unlockingWallet: PropTypes.bool,
    unlockWalletError: PropTypes.string
  }

  /**
   * Handle click event on the Create new wallet button,
   */
  handleCreateNewWalletClick = () => {
    const { history } = this.props
    history.push('/onboarding')
  }

  render() {
    const {
      activeWallet,
      deleteWallet,
      startLnd,
      unlockWallet,
      wallets,
      setActiveWallet,
      stopLnd,
      lightningGrpcActive,
      walletUnlockerGrpcActive,
      setUnlockWalletError,
      unlockingWallet,
      unlockWalletError
    } = this.props

    return (
      <>
        <Sidebar.small p={3} pt={40}>
          <ZapLogo width="70px" height="32px" />

          <WalletsMenu
            wallets={wallets}
            mt={30}
            activeWallet={activeWallet}
            setActiveWallet={setActiveWallet}
          />

          <Box width={1} css={{ position: 'absolute', left: 0, bottom: 0 }} px={3}>
            <Bar mx={-3} />
            <CreateWalletButton onClick={this.handleCreateNewWalletClick} width={1} p={3} />
          </Box>
        </Sidebar.small>

        <MainContent>
          <Box px={5} mt={72}>
            <Switch>
              <Route
                exact
                path="/home/wallet/:walletId"
                render={({ match: { params } }) => {
                  const wallet = wallets.find(wallet => wallet.id == params.walletId)
                  if (!wallet) {
                    return null
                  }
                  return (
                    <WalletLauncher
                      wallet={wallet}
                      startLnd={startLnd}
                      stopLnd={stopLnd}
                      lightningGrpcActive={lightningGrpcActive}
                      walletUnlockerGrpcActive={walletUnlockerGrpcActive}
                      deleteWallet={deleteWallet}
                    />
                  )
                }}
              />
              <Route
                exact
                path="/home/wallet/:walletId/unlock"
                render={({ match: { params } }) => {
                  const wallet = wallets.find(wallet => wallet.id == params.walletId)
                  if (!wallet) {
                    return null
                  }
                  return (
                    <WalletUnlocker
                      wallet={wallet}
                      unlockWallet={unlockWallet}
                      lightningGrpcActive={lightningGrpcActive}
                      setUnlockWalletError={setUnlockWalletError}
                      unlockingWallet={unlockingWallet}
                      unlockWalletError={unlockWalletError}
                    />
                  )
                }}
              />
              <Route component={NoMatch} />
            </Switch>
          </Box>
        </MainContent>
      </>
    )
  }
}

export default withRouter(Home)
