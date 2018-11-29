import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass'
import { Bar, MainContent, Sidebar } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'
import { CreateWalletButton, NoWallets, WalletLauncher, WalletsMenu, WalletUnlocker } from '.'

const NoMatch = ({ history, wallets }) => (
  <Flex flexDirection="column" justifyContent="center" alignItems="center" css={{ height: '100%' }}>
    <NoWallets history={history} wallets={wallets} />
  </Flex>
)
NoMatch.propTypes = {
  wallets: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
}

class Home extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    activeWallet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    deleteWallet: PropTypes.func.isRequired,
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
   * If there is an active wallet ensure it is selected on mount.
   */
  componentDidMount() {
    const { activeWallet, history } = this.props
    if (activeWallet && history.location.pathname === '/home') {
      history.push(`/home/wallet/${activeWallet}`)
    }
  }

  render() {
    const {
      history,
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
            <CreateWalletButton history={history} width={1} p={3} />
          </Box>
        </Sidebar.small>

        <MainContent>
          <Box px={5} css={{ height: '100%' }}>
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
              <Route render={() => <NoMatch history={history} wallets={wallets} />} />
            </Switch>
          </Box>
        </MainContent>
      </>
    )
  }
}

export default withRouter(Home)
