import React from 'react'

import config from 'config'
import parse from 'lndconnect/parse'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass/styled-components'
import { compose } from 'redux'
import styled from 'styled-components'

import { intlShape } from '@zap/i18n'
import parseConnectionString from '@zap/utils/btcpayserver'
import { isValidBtcPayConfig, isEmbeddedLndConnectURI } from '@zap/utils/connectionString'
import { Form } from 'components/Form'
import { Bar, Button, Heading, Text, ActionBar } from 'components/UI'

import messages from './messages'
import WalletHeader from './WalletHeader'
import WalletSettingsFormLocal, {
  validateNeutrinoNodes,
  sanitizeNeutrinoNodes,
} from './WalletSettingsFormLocal'
import WalletSettingsFormRemote from './WalletSettingsFormRemote'

const WalletActionBar = styled(ActionBar)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

const LNDCONNECT_BTCPAY_SERVER = 'LNDCONNECT_BTCPAY_SERVER'
const LNDCONNECT_EMBEDDED = 'LNDCONNECT_EMBEDDED'
const LNDCONNECT_REGULAR = 'LNDCONNECT_REGULAR'

/**
 * getLndConnectType - Determine wether an lndconnect uri uses regular or embedded format.
 *
 * @param {string} lndconnectUri lndconnect url
 * @returns {'LNDCONNECT_EMBEDDED'|'LNDCONNECT_REGULAR'} lndconnect uri type
 */
const getLndConnectType = lndconnectUri => {
  if (isValidBtcPayConfig(lndconnectUri)) {
    return LNDCONNECT_BTCPAY_SERVER
  }
  return isEmbeddedLndConnectURI(lndconnectUri) ? LNDCONNECT_EMBEDDED : LNDCONNECT_REGULAR
}

/**
 * parseBtcPayString - Extract lnd node connection details from a BTCPay Server connecttion string.
 *
 * @param {string} btcPayString BTCPay Server connecttion string
 * @returns {{host, cert, macaroon}} Lnd connection details
 */
const parseBtcPayString = btcPayString => {
  const { host, port, macaroon } = parseConnectionString(btcPayString)
  return { host: `${host}:${port}`, macaroon, cert: '' }
}

/**
 * parseLndConnectURI - Parses lndconnect uri and returns decoded cert, macaroon and host.
 *
 * @param {string} lndconnectUri Lndconnect uri
 * @returns {{host, cert, macaroon}} Host/Cert/Macaroon as parsed from lnd connect string
 */
const parseLndConnectURI = lndconnectUri => {
  try {
    const parseFunc =
      getLndConnectType(lndconnectUri) === LNDCONNECT_BTCPAY_SERVER ? parseBtcPayString : parse
    const { host, cert, macaroon } = parseFunc(lndconnectUri)

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

const { maxchannels, minchansize, maxchansize, allocation } = config.lnd.autopilot
const autopilotDefaults = {
  autopilotMaxchannels: maxchannels,
  autopilotMinchansize: minchansize,
  autopilotMaxchansize: maxchansize,
  autopilotAllocation: allocation * 100,
}

/**
 * formatAutopilot - Cleans up autopilot settings if autopilot flag is turned.
 *
 * @param {object} values Values to format
 * @returns {object} Formatted values
 */
const formatAutopilot = values => {
  const result = { ...values }
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

/**
 * clean - Deletes null undefined and empty string fields from a given object.
 *
 * @param {object} obj Object to clean
 * @returns {object} Cleaned object
 */
const clean = obj => {
  const result = { ...obj }
  Object.keys(result).forEach(
    key =>
      (result[key] === undefined || result[key] === '' || result[key] === null) &&
      delete result[key]
  )
  return result
}

/**
 * prepareValues - Format autopilot, then clean.
 *
 * @param {object} values Values to prepare
 * @returns {object} Prepared values
 */
const prepareValues = values => clean(formatAutopilot({ ...values }))

/**
 * formToWalletFormat - Converts form format to db/lnd compatible format.
 *
 * @param {object} values Values to format to prepare
 * @returns {object} Prepared values
 */
const formToWalletFormat = values => {
  const result = prepareValues(values)
  const { autopilot, autopilotAllocation, neutrinoNodes } = result
  if (autopilot && autopilotAllocation) {
    // result expects the autopilot allocation to be a decimal.
    result.autopilotAllocation = autopilotAllocation / 100
  }

  // Sanitize neutrinoNodes
  if (neutrinoNodes) {
    result.neutrinoNodes = sanitizeNeutrinoNodes(neutrinoNodes)
  }

  return result
}

/**
 * walletToFormFormat - Converts db/lnd  format to form compatible format.
 *
 * @param {object} values Values to format to prepare
 * @returns {object} Prepared values
 */
const walletToFormFormat = values => {
  const result = prepareValues(values)
  const { autopilot, autopilotAllocation } = result
  if (autopilot && autopilotAllocation) {
    // Lnd expects the autopilot allocation to be in [0..100]
    result.autopilotAllocation = autopilotAllocation * 100
  }
  return {
    ...result,
    ...parseLndConnectURI(values.lndconnectUri),
  }
}

/**
 * unsafeShallowCompare - Shallowly compares two objects using == operator. Only @whiteList props are compared.
 *
 * @param {*} obj1 Object 1 to compare
 * @param {*} obj2 Object 2 to compare
 * @param {*} whiteList of props to compare
 * @returns {boolean} True if compared props all match
 */
const unsafeShallowCompare = (obj1, obj2, whiteList) => {
  return Object.keys(whiteList).every(key => isEqual(obj1[key], obj2[key]))
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
    resetApp: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    startLnd: PropTypes.func.isRequired,
    startLndError: PropTypes.object,
    stopLnd: PropTypes.func.isRequired,
    wallet: PropTypes.object.isRequired,
  }

  state = {
    isValidating: false,
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

  // Redirect to the login page when we establish a connection to lnd.
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

  launchWallet = async () => {
    try {
      const { resetApp, startLnd, wallet } = this.props
      // discard settings edits and just launch current saved config
      resetApp()
      return await startLnd(wallet)
    } catch (e) {
      // this error is handled via startLndErrors mechanism
      // so should be ignored
      return null
    }
  }

  /**
   * saveSettings - Saves current lnd config based on current form state.
   *
   * @returns {object} The actual config that was saved
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
      const values = { ...wallet, ...formState.values }
      let result = values

      if (wallet.type === 'local') {
        result = formToWalletFormat(values)
        const {
          wallet: { chain, network },
        } = this.props
        // do not explicitly save neutrino config if it wasn't changed
        if (isEqual(result.neutrinoNodes, config.lnd.neutrino[chain][network])) {
          delete result.neutrinoNodes
          formApi.setValue('neutrinoNodes', config.lnd.neutrino[chain][network])
        } else {
          formApi.setValue('neutrinoNodes', result.neutrinoNodes)
        }
      } else {
        const hasHideLndConnectUri = typeof formApi.getValue('hideLndConnectUri') !== 'undefined'
        const lndconnectType = getLndConnectType(values.lndconnectUri)

        switch (lndconnectType) {
          case LNDCONNECT_EMBEDDED:
            // re-generate lndconnectUri and
            // QR using updated host, cert and macaroon values. This is done in the main process
            result = formToWalletFormat(
              await generateLndConfigFromWallet({
                lndconnectQRCode: values.lndconnectUri,
                ...values,
              })
            )
            break

          case LNDCONNECT_BTCPAY_SERVER: {
            const walletConfig = {
              ...values, // btcpay config we needs to be decoded down to  host, cert and macaroon first
              ...parseLndConnectURI(values.lndconnectUri),
              lndconnectUri: undefined, // delete uris so the main process re-generates them
              lndconnectQRCode: undefined,
            }
            // re-generate lndconnectUri and
            // QR using updated host, cert and macaroon values. This is done in the main process
            result = formToWalletFormat(await generateLndConfigFromWallet(walletConfig))

            formApi.setValues({ ...values, lndconnectUri: result.lndconnectUri })
            break
          }
          default: {
            const walletConfig = {
              ...values,
              lndconnectUri: undefined, // delete uris so the main process re-generates them
              lndconnectQRCode: undefined,
            }
            // re-generate lndconnectUri and
            // QR using updated host, cert and macaroon values. This is done in the main process
            result = formToWalletFormat(await generateLndConfigFromWallet(walletConfig))
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
      return null
    }
  }

  resetForm = () => {
    const { formApi } = this
    formApi.reset()
  }

  validateNeutrinoNodes = async () => {
    try {
      this.setState({
        isValidating: true,
      })
      return await validateNeutrinoNodes(this.formApi)
    } finally {
      this.setState({
        isValidating: false,
      })
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  handleDelete = () => {
    const { deleteWallet } = this.props
    deleteWallet()
  }

  render() {
    const { wallet, isStartingLnd, isNeutrinoRunning, ...rest } = this.props
    const { isValidating } = this.state
    const actionBarButtons = formState => (
      <>
        <Button key="cancel" mr={6} onClick={this.resetForm} type="button" variant="secondary">
          <FormattedMessage {...messages.button_cancel} />
        </Button>

        <Button
          isDisabled={(formState.submits > 0 && formState.invalid) || isValidating}
          isProcessing={isValidating}
          key="save"
          type="submit"
          variant="normal"
        >
          <FormattedMessage {...messages.button_save} />
        </Button>
      </>
    )

    const walletConverted = walletToFormFormat(wallet)

    const hasChanges = () => {
      const formState = this.formApi.getState()
      // to properly compare changes between current form state and db config
      // we need to
      // 1. account differences in format (like autopilotAllocation)
      // 2. Account for undefined vs unset fields
      // 3. Autopilot defaults might be missing from config which basically is the same as having no defaults
      // 4. wallet type
      // 5. it is required to use unsafe shallow compare so "5" equals 5
      if (walletConverted.type !== 'local') {
        if (getLndConnectType(walletConverted.lndconnectUri) === LNDCONNECT_EMBEDDED) {
          return !unsafeShallowCompare(clean(walletConverted), clean(formState.values), {
            name: '',
            lndconnectUri: '',
          })
        }

        const { host, cert, macaroon } = parseLndConnectURI(walletConverted.lndconnectUri)
        const orig = clean({ host, cert, macaroon, ...walletConverted })
        const updated = clean(formState.values)

        return !unsafeShallowCompare(
          // include derived host, cert, macaroon values to detect changes
          orig,
          updated,
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
        neutrinoNodes: '',
        whitelistPeers: '',
      }

      // local node
      return !unsafeShallowCompare(
        clean(formatAutopilot({ autopilot: false, ...autopilotDefaults, ...walletConverted })),
        clean(formToWalletFormat({ autopilot: false, ...autopilotDefaults, ...formState.values })),
        whiteList
      )
    }
    return (
      <Box {...rest}>
        <Form
          asyncValidators={[this.validateNeutrinoNodes]}
          getApi={this.setFormApi}
          initialValues={walletConverted}
          onSubmit={this.saveSettings}
        >
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
                  <Heading.H1 mb={5}>
                    <FormattedMessage {...messages.settings_title} />
                  </Heading.H1>

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
                <Button
                  isDisabled={isStartingLnd || isNeutrinoRunning}
                  onClick={this.handleDelete}
                  size="small"
                  type="button"
                  variant="danger"
                >
                  <FormattedMessage {...messages.delete_wallet_button_text} />
                </Button>
              </Flex>

              {hasChanges() && (
                <Box mt={80}>
                  <WalletActionBar buttons={actionBarButtons(formState)} />
                </Box>
              )}
            </Box>
          )}
        </Form>
      </Box>
    )
  }
}

export default compose(withRouter, injectIntl)(WalletLauncher)
