import React from 'react'
import PropTypes from 'prop-types'
import config from 'config'
import { compose } from 'redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import parse from 'lndconnect/parse'
import { isValidBtcPayConfig, isEmbeddedLndConnectURI } from '@zap/utils/connectionString'
import parseConnectionString from '@zap/utils/btcpayserver'
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

const { maxchannels, minchansize, maxchansize, allocation } = config.lnd.autopilot
const autopilotDefaults = {
  autopilotMaxchannels: maxchannels,
  autopilotMinchansize: minchansize,
  autopilotMaxchansize: maxchansize,
  autopilotAllocation: allocation * 100,
}

// cleans up autopay settings if autopilot flag is turned
const formatAutopilot = values => {
  const result = Object.assign({}, values)
  if (!values.autopilot) {
    // remove autopilot related fields if it's turned off
    delete result.autopilotAllocation
    delete result.autopilotMaxchannels
    delete result.autopilotMaxchansize
    delete result.autopilotMinchansize
    delete result.autopilotMinconfs
    delete result.autopilotPrivate
  }
  return result
}

// converts form format to db/lnd compatible format
const formToWalletFormat = values => {
  const result = Object.assign({}, formatAutopilot(values))
  const { autopilot, autopilotAllocation } = result
  if (autopilot && autopilotAllocation) {
    // result expects the autopilot allocation to be a decimal.
    result.autopilotAllocation = autopilotAllocation / 100
  }
  return result
}

// converts db/lnd  format to form compatible format
const walletToFormFormat = values => {
  const result = Object.assign({}, formatAutopilot(values))
  const { autopilot, autopilotAllocation } = result
  if (autopilot && autopilotAllocation) {
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

const LNDCONNECT_BTCPAY_SERVER = 'LNDCONNECT_BTCPAY_SERVER'
const LNDCONNECT_EMBEDDED = 'LNDCONNECT_EMBEDDED'
const LNDCONNECT_REGULAR = 'LNDCONNECT_REGULAR'

const getLndConnectType = lndconnectUri => {
  if (isValidBtcPayConfig(lndconnectUri)) {
    return LNDCONNECT_BTCPAY_SERVER
  }
  return isEmbeddedLndConnectURI(lndconnectUri) ? LNDCONNECT_EMBEDDED : LNDCONNECT_REGULAR
}

/**
 * Parses lndconnect uri and returns decoded cert, macaroon and host
 */
const parseLndConnectURI = uri => {
  const parseBtcPayString = uri => {
    const { host, port, macaroon } = parseConnectionString(uri)
    return { host: `${host}:${port}`, macaroon, cert: '' }
  }

  try {
    const parseFunc =
      getLndConnectType(uri) === LNDCONNECT_BTCPAY_SERVER ? parseBtcPayString : parse
    const { host, cert, macaroon } = parseFunc(uri)
    return {
      host: host && decodeURIComponent(host),
      cert: cert && decodeURIComponent(cert),
      macaroon: macaroon && decodeURIComponent(macaroon),
    }
  } catch (e) {
    return {
      host: '',
      cert: '',
      macaroon: '',
    }
  }
}

class WalletLauncher extends React.Component {
  static propTypes = {
    clearStartLndError: PropTypes.func.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    generateLndConfigFromWallet: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    intl: intlShape.isRequired,
    isLightningGrpcActive: PropTypes.bool.isRequired,
    isNeutrinoRunning: PropTypes.bool.isRequired,
    isStartingLnd: PropTypes.bool.isRequired,
    isWalletUnlockerGrpcActive: PropTypes.bool.isRequired,
    putWallet: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    startLnd: PropTypes.func.isRequired,
    startLndError: PropTypes.object,
    stopLnd: PropTypes.func.isRequired,
    wallet: PropTypes.object.isRequired,
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
      isLightningGrpcActive,
      isWalletUnlockerGrpcActive,
      startLndError,
      showError,
      clearStartLndError,
      wallet,
    } = this.props

    // If we got lnd start errors, show as a global error.
    if (startLndError && !prevProps.startLndError) {
      Object.keys(startLndError).forEach(key => showError(startLndError[key]))
      clearStartLndError()
    }

    // If the wallet unlocker became active, switch to the login screen
    if (isWalletUnlockerGrpcActive && !prevProps.isWalletUnlockerGrpcActive) {
      history.push(`/home/wallet/${wallet.id}/unlock`)
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

  launchWallet = () => {
    const { startLnd, wallet } = this.props
    // discard settings edits and just launch current saved config
    return startLnd(wallet)
  }

  /**
   * Saves current lnd config based on current form state
   * Returns the actual config that was saved
   * @memberof WalletLauncher
   */
  saveSettings = async () => {
    const {
      generateLndConfigFromWallet,
      putWallet,
      showNotification,
      showError,
      intl,
      wallet,
    } = this.props
    try {
      const { formApi } = this
      const formState = formApi.getState()
      const values = Object.assign({}, wallet, formState.values)
      let result = values

      if (wallet.type === 'local') {
        result = formToWalletFormat(values)
      } else {
        const hasHideLndConnectUri = typeof formApi.getValue('hideLndConnectUri') !== 'undefined'
        const lndconnectType = getLndConnectType(values.lndconnectUri)

        switch (lndconnectType) {
          case LNDCONNECT_EMBEDDED:
            // re-generate lndconnectUri and
            // QR using updated host, cert and macaroon values. This is done in the main process
            result = formToWalletFormat(
              await generateLndConfigFromWallet(
                Object.assign({}, { lndconnectQRCode: values.lndconnectUri }, values)
              )
            )
            break

          case LNDCONNECT_BTCPAY_SERVER: {
            const config = Object.assign({}, values, {
              // btcpay config we needs to be decoded down to  host, cert and macaroon first
              ...parseLndConnectURI(values.lndconnectUri),
              lndconnectUri: undefined, // delete uris so the main process re-generates them
              lndconnectQRCode: undefined,
            })
            // re-generate lndconnectUri and
            // QR using updated host, cert and macaroon values. This is done in the main process
            result = formToWalletFormat(await generateLndConfigFromWallet(config))

            formApi.setValues(Object.assign({}, values, { lndconnectUri: result.lndconnectUri }))
            break
          }
          default: {
            const config = Object.assign({}, values, {
              lndconnectUri: undefined, // delete uris so the main process re-generates them
              lndconnectQRCode: undefined,
            })

            // re-generate lndconnectUri and
            // QR using updated host, cert and macaroon values. This is done in the main process
            result = formToWalletFormat(await generateLndConfigFromWallet(config))
            break
          }
        }

        // hide lnd connect after save is complete
        if (hasHideLndConnectUri) {
          formApi.setValue('hideLndConnectUri', true)
        }
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
    const { formApi } = this
    // for remote wallets manually reset cert, macaroon and host since they are derived from
    // lndconnect uri
    const resetValues =
      wallet.type === 'local'
        ? wallet
        : Object.assign({}, { ...parseLndConnectURI(wallet.lndconnectUri) }, wallet)

    formApi.setValues(walletToFormFormat(resetValues))

    // reset errors
    if (formApi.getTouched('lndconnectUri')) {
      formApi.setTouched('lndconnectUri', false)
    }
    if (formApi.getError('lndconnectUri')) {
      formApi.setError('lndconnectUri', undefined)
    }
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
      if (getLndConnectType(wallet.lndconnectUri) === LNDCONNECT_EMBEDDED) {
        return !unsafeShallowCompare(clean(wallet), clean(formState.values), {
          name: '',
          lndconnectUri: '',
        })
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
          macaroon: '',
        }
      )
    }

    const whiteList = {
      ...autopilotDefaults,
      autopilot: '',
      alias: '',
      name: '',
    }
    // local node
    return !unsafeShallowCompare(
      clean(formatAutopilot(Object.assign({}, { autopilot: false }, autopilotDefaults, wallet))),
      clean(
        formToWalletFormat(
          Object.assign({}, { autopilot: false }, autopilotDefaults, formState.values)
        )
      ),
      whiteList
    )
  }

  render() {
    const { wallet, isStartingLnd, isNeutrinoRunning } = this.props
    const actionBarButtons = formState => (
      <>
        <Button key="cancel" mr={6} onClick={this.resetForm} type="button" variant="secondary">
          <FormattedMessage {...messages.button_cancel} />
        </Button>

        <Button
          key="save"
          isDisabled={formState.submits > 0 && formState.invalid}
          type="submit"
          variant="normal"
        >
          <FormattedMessage {...messages.button_save} />
        </Button>
      </>
    )

    const walletConverted = walletToFormFormat(wallet)

    return (
      <Box css={{ height: '100%', 'overflow-y': 'overlay' }} pb={6} pt={4} px={5}>
        <Form getApi={this.setFormApi} initialValues={walletConverted} onSubmit={this.saveSettings}>
          {({ formState }) => (
            <Box>
              <Flex alignItems="center" mb={4}>
                <Box mr={3} width="75%">
                  <WalletHeader wallet={wallet} />
                </Box>
                <Flex flexDirection="column" justifyContent="flex-end" ml="auto">
                  <Button
                    isDisabled={isStartingLnd || isNeutrinoRunning}
                    isProcessing={isStartingLnd}
                    ml={2}
                    onClick={this.launchWallet}
                    size="small"
                    type="button"
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
                  isEmbeddedConnectionString={isEmbeddedLndConnectURI(wallet.lndconnectUri)}
                  wallet={walletConverted}
                  {...parseLndConnectURI(wallet.lndconnectUri)}
                />
              )}

              <Text fontWeight="normal" mt={4}>
                <FormattedMessage {...messages.section_delete_title} />
              </Text>
              <Bar my={2} />

              <Flex justifyContent="center" my={4}>
                <Button onClick={this.handleDelete} size="small" type="button">
                  <FormattedMessage {...messages.delete_wallet_button_text} />
                </Button>
              </Flex>

              {this.hasChanges() && <WalletActionBar buttons={actionBarButtons(formState)} />}
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
