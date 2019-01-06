import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass'
import { Bar, MainContent, Panel, Sidebar } from 'components/UI'
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
    activeWalletSettings: PropTypes.object,
    deleteWallet: PropTypes.func.isRequired,
    lndConnect: PropTypes.object,
    startLndError: PropTypes.object,
    lightningGrpcActive: PropTypes.bool.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
    wallets: PropTypes.array.isRequired,
    startLnd: PropTypes.func.isRequired,
    stopLnd: PropTypes.func.isRequired,
    setActiveWallet: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired,
    setUnlockWalletError: PropTypes.func.isRequired,
    setStartLndError: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    unlockingWallet: PropTypes.bool,
    unlockWalletError: PropTypes.string
  }

  /**
   * If there is an active wallet ensure it is selected on mount.
   */
  componentDidMount() {
    const { activeWallet, activeWalletSettings, history } = this.props
    if (activeWallet && activeWalletSettings && history.location.pathname === '/home') {
      history.push(`/home/wallet/${activeWallet}`)
    }
  }

  componentDidUpdate(prevProps) {
    const { lndConnect, history } = this.props
    if (lndConnect && lndConnect !== prevProps.lndConnect) {
      history.push(`/onboarding`)
    }
  }

  render() {
    const {
      history,
      activeWallet,
      deleteWallet,
      startLnd,
      startLndError,
      unlockWallet,
      wallets,
      setActiveWallet,
      setError,
      setStartLndError,
      stopLnd,
      lightningGrpcActive,
      walletUnlockerGrpcActive,
      setUnlockWalletError,
      unlockingWallet,
      unlockWalletError
    } = this.props

    return (
      <>
        <Sidebar.small px={4} pt={40}>
          <Panel>
            <Panel.Header>
              <ZapLogo width="70px" height="32px" />
            </Panel.Header>
            <Panel.Body>
              <WalletsMenu
                wallets={wallets}
                mt={30}
                activeWallet={activeWallet}
                setActiveWallet={setActiveWallet}
              />
            </Panel.Body>
            <Panel.Footer>
              <Bar mx={-4} />
              <Box py={2}>
                <CreateWalletButton history={history} width={1} />
              </Box>
            </Panel.Footer>
          </Panel>
        </Sidebar.small>

        <MainContent pt={40}>
          <Box px={5} css={{ height: '100%' }}>
            <Switch>
              <Route
                exact
                path="/home/wallet/:walletId"
                render={({ match: { params } }) => {
                  const wallet = wallets.find(wallet => wallet.id == params.walletId)
                  if (!wallet) {
                    return <Redirect to="/home" />
                  }
                  return (
                    <WalletLauncher
                      wallet={wallet}
                      startLnd={startLnd}
                      stopLnd={stopLnd}
                      lightningGrpcActive={lightningGrpcActive}
                      walletUnlockerGrpcActive={walletUnlockerGrpcActive}
                      startLndError={startLndError}
                      setError={setError}
                      setStartLndError={setStartLndError}
                      deleteWallet={deleteWallet}
                      key={wallet.id}
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
                    return <Redirect to="/home" />
                  }
                  return (
                    <WalletUnlocker
                      wallet={wallet}
                      unlockWallet={unlockWallet}
                      lightningGrpcActive={lightningGrpcActive}
                      setUnlockWalletError={setUnlockWalletError}
                      unlockingWallet={unlockingWallet}
                      unlockWalletError={unlockWalletError}
                      key={wallet.id}
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
