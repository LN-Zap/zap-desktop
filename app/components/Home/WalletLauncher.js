import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import parse from 'lndconnect/parse'
import { isBase64url } from 'lib/utils'
import { Bar, Button, Heading, Text, ActionBar, Form } from 'components/UI'
import WalletSettingsFormLocal from './WalletSettingsFormLocal'
import WalletSettingsFormRemote from './WalletSettingsFormRemote'
import WalletHeader from './WalletHeader'
import messages from './messages'

const WalletActionBar = styled(ActionBar)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

const autopilotDefaults = {
  autopilotMaxchannels: 5,
  autopilotMinchansize: 20000,
  autopilotMaxchansize: 16777215,
  autopilotAllocation: 60
}

// converts form format to db/lnd compatible format
const formToWalletFormat = values => {
  const result = Object.assign({}, values)
  const { autopilotAllocation } = result
  if (autopilotAllocation) {
    // result expects the autopilot allocation to be a decimal.
    result.autopilotAllocation = autopilotAllocation / 100
  }
  return result
}

// converts db/lnd  format to form compatible format
const walletToFormFormat = values => {
  const result = Object.assign({}, values)
  const { autopilotAllocation } = result
  if (autopilotAllocation) {
    // Lnd expects the autopilot allocation to be in [0..100]
    result.autopilotAllocation = autopilotAllocation * 100
  }
  return result
}

// deletes null undefined and empty string fields from a given object
const clean = obj => {
  const result = Object.assign({}, obj)
  Object.keys(result).forEach(
    key =>
      (result[key] === undefined || result[key] === '' || result[key] === null) &&
      delete result[key]
  )
  return result
}

/**
 * Shallowly compares two objects using == operator. Only @whiteList props are compared
 * @param {*} obj1
 * @param {*} obj2
 * @param {*} whiteList
 */
const unsafeShallowCompare = (obj1, obj2, whiteList) => {
  return Object.keys(whiteList).every(key => obj1[key] == obj2[key])
}

/**
 * Parses lndconnect uri and returns decoded cert, macaroon and host
 */
const parseLndConnectURI = uri => {
  const { host, cert, macaroon } = parse(uri)
  return {
    host: decodeURIComponent(host),
    cert: decodeURIComponent(cert),
    macaroon: decodeURIComponent(macaroon)
  }
}
/**
 * checks if lndconnect uri contains raw cert or macaroon and not paths
 */
const isEmbeddedLndConnectURI = uri => {
  const { cert, macaroon } = parse(uri)
  return isBase64url(cert) || isBase64url(macaroon)
}

class WalletLauncher extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    wallet: PropTypes.object.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    startLnd: PropTypes.func.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
    startLndError: PropTypes.object,
    startingLnd: PropTypes.bool.isRequired,
    clearStartLndError: PropTypes.func.isRequired,
    putWallet: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    stopLnd: PropTypes.func.isRequired,
    refreshLndConnectURI: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }

  componentDidMount() {
    const { stopLnd, startLndError, showError, clearStartLndError } = this.props
    stopLnd()

    // If there are lnd start errors, show as a global error.
    if (startLndError) {
      Object.keys(startLndError).forEach(key => showError(startLndError[key]))
      clearStartLndError()
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
      clearStartLndError,
      wallet
    } = this.props

    // If we got lnd start errors, show as a global error.
    if (startLndError && !prevProps.startLndError) {
      Object.keys(startLndError).forEach(key => showError(startLndError[key]))
      clearStartLndError()
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

  onSubmit = async values => {
    const { startLnd, wallet } = this.props
    // for the remote wallets we need to initiate lndconnect URI re-generation before launching
    if (wallet.type !== 'local' && this.hasChanges()) {
      const config = await this.saveSettings()
      return startLnd(config)
    }
    return startLnd(formToWalletFormat(values))
  }

  /**
   * Saves current lnd config based on current form state
   * Returns the actual config that was saved
   * @memberof WalletLauncher
   */
  saveSettings = async () => {
    const {
      refreshLndConnectURI,
      putWallet,
      showNotification,
      showError,
      intl,
      wallet
    } = this.props
    try {
      const { formApi } = this
      const formState = formApi.getState()
      const { values } = formState
      let result = values

      // for the remote wallets we need to re-generate lndconnectUri and QR using updated
      // host, cert and macaroon values. This is done in the main process
      // this process is skipped if original lndconnect uri contains raw cert or macaroon and not paths
      if (wallet.type !== 'local' && !isEmbeddedLndConnectURI(wallet.lndconnectUri)) {
        // wait for the config generate complete message from the main process
        const generatedConfig = formToWalletFormat(
          await refreshLndConnectURI(
            Object.assign({}, values, {
              lndconnectUri: undefined, // delete wallets so the main process re-generates them
              lndconnectQRCode: undefined
            })
          )
        )

        // update form state with decoded host, cert and macaroon since they are derived from
        // lndconnect uri and thus corresponding fields will go blank after new config is set
        const { host, cert, macaroon } = parseLndConnectURI(generatedConfig.lndconnectUri)
        formApi.setValues(Object.assign({}, generatedConfig, { host, cert, macaroon }))
        result = generatedConfig
      } else {
        result = formToWalletFormat(values)
      }

      putWallet(result)

      const message = intl.formatMessage({ ...messages.saved_notification })
      showNotification(message)

      return result
    } catch (e) {
      const message = intl.formatMessage({ ...messages.saved_error })
      showError(message)
    }
  }

  resetForm = () => {
    const { wallet } = this.props
    // for remote wallets manually reset cert, macaroon and host since they are derived from
    // lndconnect uri
    const resetValues =
      wallet.type === 'local'
        ? wallet
        : Object.assign({}, { ...parseLndConnectURI(wallet.lndconnectUri) }, wallet)

    this.formApi.setValues(walletToFormFormat(resetValues))
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  handleDelete = () => {
    const { deleteWallet } = this.props
    deleteWallet()
  }

  hasChanges = () => {
    const { wallet } = this.props
    const formState = this.formApi.getState()
    // to properly compare changes between current form state and db config
    // we need to
    // 1. account differences in format (like autopilotAllocation)
    // 2. Account for undefined vs unset fields
    // 3. Autopilot defaults might be missing from config which basically is the same as having no defaults
    // 4. wallet type
    // 5. it is required to use unsafe shallow compare so "5" equals 5
    if (wallet.type !== 'local') {
      if (isEmbeddedLndConnectURI(wallet.lndconnectUri)) {
        return !unsafeShallowCompare(clean(wallet), clean(formState.values), { name: '' })
      }

      const { host, cert, macaroon } = parseLndConnectURI(wallet.lndconnectUri)
      return !unsafeShallowCompare(
        // include derived host, cert, macaroon values to detect changes
        clean(Object.assign({}, { host, cert, macaroon }, wallet)),
        clean(formState.values),
        {
          name: '',
          cert: '',
          host: '',
          macaroon: ''
        }
      )
    }

    const whiteList = {
      ...autopilotDefaults,
      autopilot: '',
      alias: '',
      name: ''
    }
    // local node
    return !unsafeShallowCompare(
      clean(Object.assign({}, { autopilot: false }, formToWalletFormat(autopilotDefaults), wallet)),
      clean(
        formToWalletFormat(
          Object.assign({}, { autopilot: false }, autopilotDefaults, formState.values)
        )
      ),
      whiteList
    )
  }

  render() {
    const { wallet, startingLnd } = this.props
    const actionBarButtons = (
      <>
        <Button type="button" key="cancel" variant="secondary" mr={6} onClick={this.resetForm}>
          <FormattedMessage {...messages.button_cancel} />
        </Button>

        <Button type="button" key="save" variant="normal" onClick={this.saveSettings}>
          <FormattedMessage {...messages.button_save} />
        </Button>
      </>
    )

    const walletConverted = walletToFormFormat(wallet)

    return (
      <Box css={{ height: '100%', 'overflow-y': 'overlay' }} pt={4} px={5} pb={6}>
        <Form getApi={this.setFormApi} onSubmit={this.onSubmit} initialValues={walletConverted}>
          {() => (
            <Box>
              <Flex mb={4} alignItems="center">
                <Box width="75%" mr={3}>
                  <WalletHeader wallet={wallet} />
                </Box>
                <Flex ml="auto" justifyContent="flex-end" flexDirection="column">
                  <Button
                    type="submit"
                    size="small"
                    ml={2}
                    disabled={startingLnd}
                    processing={startingLnd}
                  >
                    <FormattedMessage {...messages.launch_wallet_button_text} />
                  </Button>
                </Flex>
              </Flex>

              {wallet.type === 'local' ? (
                <>
                  <Heading.h1 mb={5}>
                    <FormattedMessage {...messages.settings_title} />
                  </Heading.h1>

                  <WalletSettingsFormLocal
                    autopilotDefaults={autopilotDefaults}
                    wallet={walletConverted}
                  />
                </>
              ) : (
                <WalletSettingsFormRemote
                  wallet={walletConverted}
                  showConnectionSettings={!isEmbeddedLndConnectURI(wallet.lndconnectUri)}
                  {...parseLndConnectURI(wallet.lndconnectUri)}
                />
              )}

              <Text mt={4} fontWeight="normal">
                <FormattedMessage {...messages.section_delete_title} />
              </Text>
              <Bar my={2} />

              <Flex justifyContent="center" my={4}>
                <Button size="small" onClick={this.handleDelete} type="button">
                  <FormattedMessage {...messages.delete_wallet_button_text} />
                </Button>
              </Flex>

              {this.hasChanges() && <WalletActionBar buttons={actionBarButtons} />}
            </Box>
          )}
        </Form>
      </Box>
    )
  }
}

export default compose(
  withRouter,
  injectIntl
)(WalletLauncher)
