import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass/styled-components'
import { Bar, MainContent, Panel, Sidebar } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'
import CreateWalletButton from './CreateWalletButton'
import NoWallets from './NoWallets'
import WalletLauncher from './WalletLauncher'
import WalletsMenu from './WalletsMenu'
import WalletUnlocker from './WalletUnlocker'

const NoMatch = ({ history, wallets }) => (
  <Flex alignItems="center" flexDirection="column" height="100%" justifyContent="center">
    <NoWallets history={history} wallets={wallets} />
  </Flex>
)
NoMatch.propTypes = {
  history: PropTypes.object.isRequired,
  wallets: PropTypes.array.isRequired,
}

class Home extends React.Component {
  static propTypes = {
    activeWallet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    activeWalletSettings: PropTypes.object,
    clearStartLndError: PropTypes.func.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    generateLndConfigFromWallet: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    isLightningGrpcActive: PropTypes.bool.isRequired,
    isNeutrinoRunning: PropTypes.bool.isRequired,
    isStartingLnd: PropTypes.bool,
    isUnlockingWallet: PropTypes.bool,
    isWalletUnlockerGrpcActive: PropTypes.bool.isRequired,
    lndConnect: PropTypes.string,
    putWallet: PropTypes.func.isRequired,
    setActiveWallet: PropTypes.func.isRequired,
    setIsWalletOpen: PropTypes.func.isRequired,
    setUnlockWalletError: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    startLnd: PropTypes.func.isRequired,
    startLndError: PropTypes.object,
    stopLnd: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired,
    unlockWalletError: PropTypes.string,
    wallets: PropTypes.array.isRequired,
  }

  // If there is an active wallet ensure it is selected on mount.
  componentDidMount() {
    const { activeWallet, activeWalletSettings, history, setIsWalletOpen } = this.props
    if (activeWallet && activeWalletSettings && history.location.pathname === '/home') {
      history.push(`/home/wallet/${activeWallet}`)
    }

    setIsWalletOpen(false)
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
      isStartingLnd,
      unlockWallet,
      wallets,
      setActiveWallet,
      clearStartLndError,
      showError,
      stopLnd,
      isNeutrinoRunning,
      isLightningGrpcActive,
      isWalletUnlockerGrpcActive,
      setUnlockWalletError,
      isUnlockingWallet,
      unlockWalletError,
      putWallet,
      showNotification,
      generateLndConfigFromWallet,
    } = this.props

    return (
      <>
        <Sidebar.medium pt={40}>
          <Panel>
            <Panel.Header mb={40} px={4}>
              <ZapLogo height={28} width={28} />
            </Panel.Header>
            <Panel.Body sx={{ overflowY: 'overlay' }}>
              <WalletsMenu
                activeWallet={activeWallet}
                setActiveWallet={setActiveWallet}
                wallets={wallets}
              />
            </Panel.Body>
            <Panel.Footer>
              <Bar variant="light" />
              <Box px={4} py={2}>
                <CreateWalletButton history={history} width={1} />
              </Box>
            </Panel.Footer>
          </Panel>
        </Sidebar.medium>

        <MainContent pb={2} pl={5} pr={6} pt={4}>
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
                    key={wallet.id}
                    clearStartLndError={clearStartLndError}
                    deleteWallet={deleteWallet}
                    generateLndConfigFromWallet={generateLndConfigFromWallet}
                    isLightningGrpcActive={isLightningGrpcActive}
                    isNeutrinoRunning={isNeutrinoRunning}
                    isStartingLnd={isStartingLnd}
                    isWalletUnlockerGrpcActive={isWalletUnlockerGrpcActive}
                    putWallet={putWallet}
                    showError={showError}
                    showNotification={showNotification}
                    startLnd={startLnd}
                    startLndError={startLndError}
                    stopLnd={stopLnd}
                    wallet={wallet}
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
                    key={wallet.id}
                    isLightningGrpcActive={isLightningGrpcActive}
                    isUnlockingWallet={isUnlockingWallet}
                    setUnlockWalletError={setUnlockWalletError}
                    unlockWallet={unlockWallet}
                    unlockWalletError={unlockWalletError}
                    wallet={wallet}
                  />
                )
              }}
            />
            <Route render={() => <NoMatch history={history} wallets={wallets} />} />
          </Switch>
        </MainContent>
      </>
    )
  }
}

export default withRouter(Home)
