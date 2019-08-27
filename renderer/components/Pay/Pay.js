import React from 'react'
import PropTypes from 'prop-types'
import config from 'config'
import { injectIntl } from 'react-intl'
import { decodePayReq, getMaxFee, isOnchain, isLn } from '@zap/utils/crypto'
import { Panel } from 'components/UI'
import { Form } from 'components/Form'
import { getAmountInSats, getFeeRate } from './utils'
import PayPanelBody from './PayPanelBody'
import PayPanelFooter from './PayPanelFooter'
import PayPanelHeader from './PayPanelHeader'
import { PAY_FORM_STEPS } from './constants'
import { intlShape } from '@zap/i18n'

class Pay extends React.Component {
  static propTypes = {
    chain: PropTypes.string.isRequired,
    chainName: PropTypes.string.isRequired,
    changeFilter: PropTypes.func.isRequired,
    channelBalance: PropTypes.number.isRequired,
    closeModal: PropTypes.func.isRequired,
    cryptoUnit: PropTypes.string.isRequired,
    cryptoUnitName: PropTypes.string.isRequired,
    fetchTickers: PropTypes.func.isRequired,
    initialAmountCrypto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    initialAmountFiat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    intl: intlShape.isRequired,
    isProcessing: PropTypes.bool,
    isQueryingFees: PropTypes.bool,
    lndTargetConfirmations: PropTypes.shape({
      fast: PropTypes.number.isRequired,
      medium: PropTypes.number.isRequired,
      slow: PropTypes.number.isRequired,
    }).isRequired,
    maxOneTimeSend: PropTypes.number.isRequired,
    mx: PropTypes.string,
    network: PropTypes.string.isRequired,
    onchainFees: PropTypes.shape({
      fast: PropTypes.number,
      medium: PropTypes.number,
      slow: PropTypes.number,
    }),
    payInvoice: PropTypes.func.isRequired,
    queryFees: PropTypes.func.isRequired,
    queryRoutes: PropTypes.func.isRequired,
    redirectPayReq: PropTypes.object,
    routes: PropTypes.array,
    sendCoins: PropTypes.func.isRequired,
    setRedirectPayReq: PropTypes.func.isRequired,
    walletBalanceConfirmed: PropTypes.number.isRequired,
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
    isLn: null,
    isOnchain: null,
  }

  // Set a flag so that we can trigger form submission in componentDidUpdate once the form is loaded.
  componentDidMount() {
    const { fetchTickers, queryFees } = this.props
    fetchTickers()
    queryFees()
  }

  componentDidUpdate(prevProps, prevState) {
    const { redirectPayReq, queryRoutes, setRedirectPayReq } = this.props
    const { currentStep, invoice, isOnchain } = this.state
    const { address, amount } = redirectPayReq || {}
    const { payReq: prevPayReq } = prevProps || {}
    const { address: prevAddress, amount: prevAmount } = prevPayReq || {}

    // If redirectPayReq is set, clear it and then use it's values to autopopulate and submit the form.
    if (redirectPayReq) {
      setRedirectPayReq(null)
      return this.autoFillForm(address, amount)
    }

    // If payReq address or amount has has changed update the relevant form values.
    const isChangedAddress = address !== prevAddress
    const isChangedAmount = amount !== prevAmount
    if (isChangedAddress || isChangedAmount) {
      return this.autoFillForm(address, amount)
    }

    // If we have gone back to the address step, unmark all fields from being touched.
    if (currentStep !== prevState.currentStep) {
      if (currentStep === PAY_FORM_STEPS.address) {
        Object.keys(this.formApi.getState().touched).forEach(field => {
          this.formApi.setTouched(field, false)
        })
      }
    }

    // If we now have a valid onchain address, trigger the form submit to move to the amount step.
    const isNowOnchain = isOnchain && isOnchain !== prevState.isOnchain
    if (currentStep === PAY_FORM_STEPS.address && isNowOnchain) {
      this.formApi.submitForm()
    }

    // If we now have a valid lightning invoice submit the form.
    const isNowLightning = invoice && invoice !== prevState.invoice
    if (currentStep === PAY_FORM_STEPS.address && isNowLightning) {
      this.formApi.submitForm()
    }

    // update route
    if (
      invoice &&
      prevState.currentStep === PAY_FORM_STEPS.address &&
      currentStep === PAY_FORM_STEPS.summary
    ) {
      const { payeeNodeKey } = invoice
      queryRoutes(payeeNodeKey, this.amountInSats())
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
    const amount = this.formApi.getValue('amountCrypto') || 0

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
      changeFilter,
      closeModal,
    } = this.props
    const { isOnchain } = this.state

    if (isOnchain) {
      // Determine the fee rate to use.
      const satPerByte = this.getFee()

      // Send the coins.
      sendCoins({
        addr: values.payReq,
        value: values.amountCrypto,
        cryptoUnit: cryptoUnit,
        satPerByte: satPerByte,
        isCoinSweep: values.isCoinSweep,
      })
    } else {
      // Pay LN invoice
      payInvoice({
        payReq: values.payReq,
        amt: this.amountInSats(),
        feeLimit: getMaxFee(routes),
        retries: config.invoices.retryCount,
      })
      // Clear payment request
      setRedirectPayReq(null)
    }

    // Change the transaction filter to ALL transactions
    changeFilter('ALL_ACTIVITY')
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
    const { isLn, isOnchain, invoice } = this.state
    let steps = [PAY_FORM_STEPS.address]
    if (isLn) {
      // If we have an invoice and the invoice has an amount, this is a 2 step form.
      if (invoice && (invoice.satoshis || invoice.millisatoshis)) {
        steps.push(PAY_FORM_STEPS.summary)
      }
      // Othersise, it will be a three step process.
      else {
        steps = [PAY_FORM_STEPS.address, PAY_FORM_STEPS.amount, PAY_FORM_STEPS.summary]
      }
    } else if (isOnchain) {
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
   * handlePayReqChange - Set isLn/isOnchain state based on payReq value.
   *
   * @param {string} payReq Payment request
   */
  handlePayReqChange = payReq => {
    const { chain, network } = this.props
    const state = {
      currentStep: PAY_FORM_STEPS.address,
      isLn: null,
      isOnchain: null,
      invoice: null,
    }

    // See if the user has entered a valid lightning payment request.
    if (isLn(payReq, chain, network)) {
      try {
        const invoice = decodePayReq(payReq)
        state.invoice = invoice
      } catch (e) {
        return
      }
      state.isLn = true
    }

    // Otherwise, see if we have a valid onchain address.
    else if (isOnchain(payReq, chain, network)) {
      state.isOnchain = true
    }

    // Update the state with our findings.
    this.setState(state)
  }

  render() {
    const { currentStep, invoice, isLn, isOnchain, previousStep } = this.state
    const {
      chain,
      chainName,
      changeFilter,
      channelBalance,
      closeModal,
      cryptoUnit,
      cryptoUnitName,
      fetchTickers,
      initialAmountCrypto,
      initialAmountFiat,
      intl,
      isProcessing,
      isQueryingFees,
      lndTargetConfirmations,
      network,
      onchainFees,
      payInvoice,
      queryFees,
      queryRoutes,
      redirectPayReq,
      routes,
      sendCoins,
      setRedirectPayReq,
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
                isLn={isLn}
                isOnchain={isOnchain}
              />
            </Panel.Header>
            <Panel.Body py={3}>
              <PayPanelBody
                amountInSats={this.amountInSats()}
                chain={chain}
                chainName={chainName}
                cryptoUnit={cryptoUnit}
                cryptoUnitName={cryptoUnitName}
                currentStep={currentStep}
                formApi={this.formApi}
                handlePayReqChange={this.handlePayReqChange}
                initialAmountCrypto={initialAmountCrypto}
                initialAmountFiat={initialAmountFiat}
                intl={intl}
                invoice={invoice}
                isLn={isLn}
                isOnchain={isOnchain}
                isQueryingFees={isQueryingFees}
                lndTargetConfirmations={lndTargetConfirmations}
                network={network}
                onchainFees={onchainFees}
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
                isLn={isLn}
                isOnchain={isOnchain}
                isProcessing={isProcessing}
                maxOneTimeSend={maxOneTimeSend}
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
