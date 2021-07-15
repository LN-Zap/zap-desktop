import React from 'react'

import bip21 from 'bip21'
import config from 'config'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

import { intlShape } from '@zap/i18n'
import { convert } from '@zap/utils/btc'
import {
  decodePayReq,
  getMaxFeeInclusive,
  isOnchain,
  isBip21,
  isBolt11,
  isPubkey,
} from '@zap/utils/crypto'
import { Form } from 'components/Form'
import { Panel } from 'components/UI'

import { PAY_FORM_STEPS, PAYMENT_TYPES } from './constants'
import PayPanelBody from './PayPanelBody'
import PayPanelFooter from './PayPanelFooter'
import PayPanelHeader from './PayPanelHeader'
import { getAmountInSats, getFeeRate } from './utils'

class Pay extends React.Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
    bip21decoded: PropTypes.object,
    chain: PropTypes.string.isRequired,
    chainName: PropTypes.string.isRequired,
    channelBalance: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    cryptoUnit: PropTypes.string.isRequired,
    cryptoUnitName: PropTypes.string.isRequired,
    fetchTickers: PropTypes.func.isRequired,
    initialAmountCrypto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    initialAmountFiat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    intl: intlShape.isRequired,
    isAnimating: PropTypes.bool,
    isProcessing: PropTypes.bool,
    isQueryingFees: PropTypes.bool,
    lndTargetConfirmations: PropTypes.shape({
      fast: PropTypes.number.isRequired,
      medium: PropTypes.number.isRequired,
      slow: PropTypes.number.isRequired,
    }).isRequired,
    maxOneTimeSend: PropTypes.string.isRequired,
    mx: PropTypes.string,
    network: PropTypes.string.isRequired,
    onchainFees: PropTypes.shape({
      fast: PropTypes.string,
      medium: PropTypes.string,
      slow: PropTypes.string,
    }),
    payInvoice: PropTypes.func.isRequired,
    queryFees: PropTypes.func.isRequired,
    queryRoutes: PropTypes.func.isRequired,
    redirectPayReq: PropTypes.object,
    routes: PropTypes.array,
    sendCoins: PropTypes.func.isRequired,
    setRedirectPayReq: PropTypes.func.isRequired,
    walletBalanceConfirmed: PropTypes.string.isRequired,
    width: PropTypes.number,
  }

  static defaultProps = {
    mx: 'auto',
    onchainFees: {},
    routes: [],
    width: 1,
  }

  state = {
    currentStep: PAY_FORM_STEPS.address,
    previousStep: null,
    paymentType: PAYMENT_TYPES.none,
    loaded: false,
    invoice: null,
    bip21decoded: null,
  }

  // Set a flag so that we can trigger form submission in componentDidUpdate once the form is loaded.
  componentDidMount() {
    const { fetchTickers } = this.props
    const { loaded } = this.state
    fetchTickers()
    !loaded && this.setState({ loaded: true })
  }

  componentDidUpdate(prevProps, prevState) {
    const { cryptoUnit, redirectPayReq, queryRoutes, setRedirectPayReq } = this.props
    const { currentStep, bip21decoded, invoice, paymentType } = this.state
    const { address, amount } = redirectPayReq || {}
    const { payReq: prevPayReq } = prevProps || {}
    const { address: prevAddress, amount: prevAmount } = prevPayReq || {}

    // If redirectPayReq is set, clear it and then use it's values to autopopulate and submit the form.
    if (redirectPayReq) {
      setRedirectPayReq(null)
      this.autoFillForm(address, amount)
      return
    }

    // If payReq address or amount has has changed update the relevant form values.
    const isChangedRedirectPayReqAddress = address !== prevAddress
    const isChangedRedirectPayReqAmount = amount !== prevAmount
    if (isChangedRedirectPayReqAddress || isChangedRedirectPayReqAmount) {
      this.autoFillForm(address, amount)
      return
    }

    // If we have changed page, unmark all fields from being touched.
    if (currentStep !== prevState.currentStep) {
      Object.keys(this.formApi.getState().touched).forEach(field => {
        this.formApi.setTouched(field, false)
      })
    }

    // If we now have a valid onchain address from pasted bip21 uri into address field
    // fextract the values, fill out the form, and submit to next step.
    const isNowBip21 = bip21decoded && bip21decoded !== prevState.bip21decoded
    if (currentStep === PAY_FORM_STEPS.address && isNowBip21) {
      this.formApi.reset()
      this.formApi.setValues({
        payReq: bip21decoded.address,
        amountCrypto: convert('btc', cryptoUnit, get(bip21decoded, 'options.amount')),
      })
      this.formApi.submitForm()
      return
    }

    // If we now have a valid onchain address from pasted bitcoin address into address field
    // trigger the form submit to move to the amount step.
    const isNowOnchain =
      paymentType === PAYMENT_TYPES.onchain && paymentType !== prevState.paymentType
    if (currentStep === PAY_FORM_STEPS.address && isNowOnchain) {
      this.formApi.submitForm()
      return
    }

    // If we now have a valid pubkey, trigger the form submit to move to the amount step.
    const isNowPubkey =
      paymentType === PAYMENT_TYPES.pubkey && paymentType !== prevState.paymentType
    if (currentStep === PAY_FORM_STEPS.address && isNowPubkey) {
      this.formApi.submitForm()
      return
    }

    // If we now have a valid lightning invoice, trigger the form submit to move to the amount step.
    const isNowLightning = invoice && invoice !== prevState.invoice
    if (currentStep === PAY_FORM_STEPS.address && isNowLightning) {
      this.formApi.submitForm()
      return
    }

    // Query routes when moving to LN summary screen.
    const isNowSummary =
      currentStep === PAY_FORM_STEPS.summary && prevState.currentStep !== PAY_FORM_STEPS.summary
    if (isNowSummary) {
      if (invoice) {
        const { paymentRequest } = invoice
        queryRoutes(paymentRequest, this.amountInSats())
      } else if (paymentType === PAYMENT_TYPES.pubkey) {
        const {
          values: { payReq: pubKey },
        } = this.formApi.getState()
        queryRoutes(pubKey, this.amountInSats())
      }
    }
  }

  /**
   * autoFillForm - Autofill the form and submit to the latest possible point.
   *
   * @param {string} address Destination address
   * @param {number} amount Payment amount
   */
  autoFillForm = (address, amount) => {
    // Can't do anything if there is no address
    if (!address) {
      return
    }

    // We have the address and can set the state to "address" step
    this.setState({ currentStep: PAY_FORM_STEPS.address }, () => {
      // Reset the form and set the address value
      this.formApi.reset()
      this.formApi.setValue('payReq', address)

      // We don't have an amount so we stop here
      if (!amount) {
        return
      }

      // We have an amount so we set it and submit the form
      this.formApi.setValue('amountCrypto', amount)
      this.formApi.submitForm()
    })
  }

  /**
   * getFee - Get the current per byte fee based on the form values.
   *
   * @returns {number} Fee rate for currently selected conf speed
   */
  getFee = () => {
    const formState = this.formApi.getState()
    const { speed } = formState.values
    const { onchainFees } = this.props

    return getFeeRate(onchainFees, speed)
  }

  /**
   * amountInSats - Converts values in props and state to an amount in sats.
   *
   * @returns {number} Amount in sats based on values in state and props
   */
  amountInSats = () => {
    const { invoice } = this.state
    const { cryptoUnit } = this.props
    // Get crypto amount from the form and default to zero if it hasn't been set yet
    // otherwise you can end-up with amount equal to undefined
    const {
      values: { amountCrypto = 0 },
    } = this.formApi.getState()
    const amount = amountCrypto
    return getAmountInSats(amount, cryptoUnit, invoice)
  }

  /**
   * onSubmit - Form submit handler.
   *
   * @param {object} values Submitted form values.
   */
  onSubmit = values => {
    const { currentStep } = this.state
    // If we are on any other step but the summary (last step) go to next step
    if (currentStep !== PAY_FORM_STEPS.summary) {
      this.goToNextStep()

      return
    }

    // If we are on the summary step then we figure out if we are doing
    // an on-chain or LN transaction and send coins or pay the invoice
    const {
      cryptoUnit,
      payInvoice,
      routes,
      sendCoins,
      setRedirectPayReq,
      addFilter,
      closeModal,
    } = this.props
    const { paymentType } = this.state

    if (paymentType === PAYMENT_TYPES.onchain) {
      // Determine the fee rate to use.
      const satPerByte = this.getFee()

      // Send the coins.
      sendCoins({
        addr: values.payReq,
        value: values.amountCrypto,
        cryptoUnit,
        satPerByte,
        isCoinSweep: values.isCoinSweep,
      })
    } else if (paymentType === PAYMENT_TYPES.bolt11 || paymentType === PAYMENT_TYPES.pubkey) {
      // Pay LN invoice
      payInvoice({
        payReq: values.payReq,
        amt: this.amountInSats(),
        feeLimit: getMaxFeeInclusive(routes),
        route: get(routes, '[0].isExact') && routes[0],
        retries: config.invoices.retryCount,
      })
      // Clear payment request
      setRedirectPayReq(null)
    }

    // Change the transaction filter to include sent and pending transactions
    // to ensure user sees freshly added payment
    addFilter('SENT_ACTIVITY', 'PENDING_ACTIVITY')
    // Close the form modal once the transaction has been sent
    closeModal()
  }

  /**
   * setFormApi - Store the formApi on the component context to make it available at this.formApi.
   *
   * @param {object} formApi Informed formApi
   */
  setFormApi = formApi => {
    this.formApi = formApi
  }

  /**
   * steps - List of enabled form steps.
   *
   * @returns {string[]} List of enabled form steps
   */
  steps = () => {
    const { paymentType, invoice } = this.state
    let steps = [PAY_FORM_STEPS.address]
    if (paymentType === PAYMENT_TYPES.bolt11) {
      // If we have an invoice and the invoice has an amount, this is a 2 step form.
      if (invoice && (invoice.satoshis || invoice.millisatoshis)) {
        steps.push(PAY_FORM_STEPS.summary)
      }
      // Othersise, it will be a three step process.
      else {
        steps = [PAY_FORM_STEPS.address, PAY_FORM_STEPS.amount, PAY_FORM_STEPS.summary]
      }
    } else if (paymentType === PAYMENT_TYPES.onchain || paymentType === PAYMENT_TYPES.pubkey) {
      steps = [PAY_FORM_STEPS.address, PAY_FORM_STEPS.amount, PAY_FORM_STEPS.summary]
    }
    return steps
  }

  /**
   * goToPreviousStep - Go back to previous form step.
   */
  goToPreviousStep = () => {
    const { currentStep } = this.state
    const nextStep = Math.max(this.steps().indexOf(currentStep) - 1, 0)
    if (currentStep !== nextStep) {
      this.setState({ currentStep: this.steps()[nextStep], previousStep: currentStep })
    }
  }

  /**
   * goToNextStep - Progress to next form step.
   */
  goToNextStep = () => {
    const { currentStep } = this.state
    const allSteps = this.steps()
    const nextStepIndex = Math.min(allSteps.indexOf(currentStep) + 1, allSteps.length - 1)
    const nextStep = allSteps[nextStepIndex]
    if (currentStep !== nextStep) {
      this.setState({ currentStep: nextStep, previousStep: currentStep })
    }
  }

  /**
   * handlePayReqChange - Set payment type state based on payReq value.
   *
   * @param {string} payReq Payment request
   */
  handlePayReqChange = payReq => {
    const { chain, network } = this.props
    const state = {
      currentStep: PAY_FORM_STEPS.address,
      paymentType: PAYMENT_TYPES.none,
      invoice: null,
      bip21decoded: null,
    }

    // See if the user has entered a valid lightning payment request.
    if (isBolt11(payReq, chain, network)) {
      try {
        const invoice = decodePayReq(payReq)
        state.invoice = invoice
      } catch (e) {
        return
      }
      state.paymentType = PAYMENT_TYPES.bolt11
    }

    // Or a valid bip21 payment uri.
    else if (isBip21(payReq)) {
      try {
        const bip21decoded = bip21.decode(payReq)
        state.bip21decoded = bip21decoded
      } catch (e) {
        return
      }
      state.paymentType = PAYMENT_TYPES.onchain
    }

    // Otherwise, see if we have a valid onchain address.
    else if (isOnchain(payReq, chain, network)) {
      state.paymentType = PAYMENT_TYPES.onchain
    }

    // Or a valid pubkey.
    else if (isPubkey(payReq)) {
      state.paymentType = PAYMENT_TYPES.pubkey
    }

    // Update the state with our findings.
    this.setState(state)
  }

  render() {
    const { currentStep, invoice, paymentType, previousStep } = this.state

    const {
      bip21decoded,
      chain,
      chainName,
      channelBalance,
      cryptoUnit,
      cryptoUnitName,
      initialAmountCrypto,
      initialAmountFiat,
      intl,
      isProcessing,
      isQueryingFees,
      lndTargetConfirmations,
      network,
      onchainFees,
      queryFees,
      redirectPayReq,
      routes,
      walletBalanceConfirmed,
      maxOneTimeSend,
      ...rest
    } = this.props

    return (
      <Form height="100%" width={1} {...rest} getApi={this.setFormApi} onSubmit={this.onSubmit}>
        {({ formState }) => (
          <Panel>
            <Panel.Header>
              <PayPanelHeader
                chainName={chainName}
                cryptoUnitName={cryptoUnitName}
                paymentType={paymentType}
              />
            </Panel.Header>
            <Panel.Body py={3}>
              <PayPanelBody
                amountInSats={this.amountInSats()}
                bip21decoded={bip21decoded}
                chain={chain}
                chainName={chainName}
                cryptoUnit={cryptoUnit}
                cryptoUnitName={cryptoUnitName}
                currentStep={currentStep}
                formApi={this.formApi}
                formState={formState}
                handlePayReqChange={this.handlePayReqChange}
                initialAmountCrypto={initialAmountCrypto}
                initialAmountFiat={initialAmountFiat}
                intl={intl}
                invoice={invoice}
                isQueryingFees={isQueryingFees}
                lndTargetConfirmations={lndTargetConfirmations}
                network={network}
                onchainFees={onchainFees}
                paymentType={paymentType}
                previousStep={previousStep}
                queryFees={queryFees}
                redirectPayReq={redirectPayReq}
                routes={routes}
                walletBalanceConfirmed={walletBalanceConfirmed}
              />
            </Panel.Body>
            <Panel.Footer>
              <PayPanelFooter
                amountInSats={this.amountInSats()}
                channelBalance={channelBalance}
                cryptoUnit={cryptoUnit}
                cryptoUnitName={cryptoUnitName}
                currentStep={currentStep}
                formState={formState}
                invoice={invoice}
                isProcessing={isProcessing}
                maxOneTimeSend={maxOneTimeSend}
                paymentType={paymentType}
                previousStep={this.goToPreviousStep}
                walletBalanceConfirmed={walletBalanceConfirmed}
              />
            </Panel.Footer>
          </Panel>
        )}
      </Form>
    )
  }
}

export default injectIntl(Pay)
