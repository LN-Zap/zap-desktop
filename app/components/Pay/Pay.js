import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { animated, Keyframes, Transition } from 'react-spring'
import { FormattedMessage } from 'react-intl'
import { decodePayReq, getMinFee, getMaxFee, isOnchain, isLn } from 'lib/utils/crypto'
import { convert } from 'lib/utils/btc'
import {
  Bar,
  CryptoAmountInput,
  Dropdown,
  FiatAmountInput,
  Form,
  Message,
  Label,
  LightningInvoiceInput,
  Panel,
  Text,
  Value
} from 'components/UI'

import PayButtons from './PayButtons'
import PayHeader from './PayHeader'
import { PaySummaryLightning, PaySummaryOnChain } from '.'
import messages from './messages'

/**
 * Animation to handle showing/hiding the payReq field.
 */
const ShowHidePayReq = Keyframes.Spring({
  small: { height: 48 },
  big: async (next, cancel, ownProps) => {
    ownProps.context.focusPayReqInput()
    await next({ height: 110, immediate: true })
  }
})

/**
 * Animation to handle showing/hiding the form buttons.
 */
const ShowHideButtons = Keyframes.Spring({
  show: { opacity: 1 },
  hide: { opacity: 0 }
})

/**
 * Animation to handle showing/hiding the amount fields.
 */
const ShowHideAmount = Keyframes.Spring({
  show: async (next, cancel, ownProps) => {
    await next({ display: 'block' })
    ownProps.context.focusAmountInput()
    await next({ opacity: 1, height: 'auto' })
  },
  hide: { opacity: 0, height: 0, display: 'none' },
  remove: { opacity: 0, height: 0, display: 'none', immediate: true }
})

/**
 * Payment form (onchain & offchain)
 */
class Pay extends React.Component {
  static propTypes = {
    /** The currently active chain (bitcoin, litecoin etc) */
    chain: PropTypes.string.isRequired,
    /** The currently active chain (mainnet, testnet) */
    network: PropTypes.string.isRequired,
    /** Human readable chain name */
    cryptoName: PropTypes.string.isRequired,
    /** Current channel balance (in satoshis). */
    channelBalance: PropTypes.number.isRequired,
    /** Current ticker data as provided by blockchain.info */
    currentTicker: PropTypes.object.isRequired,
    /** Currently selected cryptocurrency (key). */
    cryptoCurrency: PropTypes.string.isRequired,
    /** Ticker symbol of the currently selected cryptocurrency. */
    cryptoCurrencyTicker: PropTypes.string.isRequired,
    /** List of supported cryptocurrencies. */
    cryptoCurrencies: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    /** List of supported fiat currencies. */
    fiatCurrencies: PropTypes.array.isRequired,
    /** Currently selected fiat currency (key). */
    fiatCurrency: PropTypes.string.isRequired,
    /** Payment address or invoice to populate the payReq field with when the form first loads. */
    initialPayReq: PropTypes.string,
    /** Amount value to populate the amountCrypto field with when the form first loads. */
    initialAmountCrypto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Amount value to populate the amountFiat field with when the form first loads. */
    initialAmountFiat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Boolean indicating wether the form is being processed. If true, form buttons are disabled. */
    isProcessing: PropTypes.bool,
    /** Boolean indicating wether fee information is currently being fetched. */
    isQueryingFees: PropTypes.bool,
    /** Boolean indicating wether routing information is currently being fetched. */
    isQueryingRoutes: PropTypes.bool,
    /** List of known nodes */
    nodes: PropTypes.array,
    /** Current fee information as provided by bitcoinfees.earn.com */
    onchainFees: PropTypes.shape({
      fastestFee: PropTypes.number,
      halfHourFee: PropTypes.number,
      hourFee: PropTypes.number
    }),
    /** Routing information */
    routes: PropTypes.array,
    /** Current wallet balance (in satoshis). */
    walletBalance: PropTypes.number.isRequired,
    /** Method to process offChain invoice payments. Called when the form is submitted. */
    payInvoice: PropTypes.func.isRequired,
    /** Set the current cryptocurrency. */
    setCryptoCurrency: PropTypes.func.isRequired,
    /** Set the current fiat currency */
    setFiatCurrency: PropTypes.func.isRequired,
    /** Method to process onChain transactions. Called when the form is submitted. */
    sendCoins: PropTypes.func.isRequired,
    /** Method to fetch fee information for onchain transactions. */
    queryFees: PropTypes.func.isRequired,
    /** Method to collect route information for lightning invoices. */
    queryRoutes: PropTypes.func.isRequired
  }

  static defaultProps = {
    initialPayReq: null,
    initialAmountCrypto: null,
    initialAmountFiat: null,
    isProcessing: false,
    isQueryingFees: false,
    isQueryingRoutes: false,
    nodes: [],
    onchainFees: {},
    routes: []
  }

  state = {
    currentStep: 'address',
    previousStep: null,
    isLn: null,
    isOnchain: null
  }

  amountInput = React.createRef()
  payReqInput = React.createRef()

  componentDidUpdate(prevProps, prevState) {
    const { initialPayReq, queryRoutes } = this.props
    const { currentStep, invoice, isLn, isOnchain } = this.state

    // If initialPayReq has been set, reset the form and submit as new
    if (initialPayReq && initialPayReq !== prevProps.initialPayReq) {
      this.formApi.reset()
      this.formApi.setValue('payReq', initialPayReq)
      this.handlePayReqChange()
    }

    // If we have gone back to the address step, unmark all fields from being touched.
    if (currentStep !== prevState.currentStep) {
      if (currentStep === 'address') {
        Object.keys(this.formApi.getState().touched).forEach(field => {
          this.formApi.setTouched(field, false)
        })
      }
    }

    // If we now have a valid onchain address, trigger the form submit.
    if (isOnchain && isOnchain !== prevState.isOnchain) {
      this.formApi.submitForm()
    }

    // If we now have a valid offchain address, trigger the form submit.
    if (isLn && isLn !== prevState.isLn) {
      this.formApi.submitForm()
      // And if now have a valid lightning invoice, call queryRoutes.
      if (invoice) {
        const { satoshis, payeeNodeKey } = invoice
        queryRoutes(payeeNodeKey, satoshis)
      }
    }
  }

  /**
   * Form submit handler.
   * @param  {Object} values submitted form values.
   */
  onSubmit = values => {
    const { currentStep, isOnchain, invoice } = this.state
    const { cryptoCurrency, onchainFees, payInvoice, routes, sendCoins } = this.props
    if (currentStep === 'summary') {
      if (isOnchain) {
        return sendCoins({
          addr: values.payReq,
          value: values.amountCrypto,
          currency: cryptoCurrency,
          satPerByte: onchainFees.fastestFee
        })
      } else {
        return payInvoice({
          addr: values.payReq,
          value: invoice.satoshis || values.amountCrypto,
          currency: invoice.satoshis ? 'sats' : cryptoCurrency,
          feeLimit: getMaxFee(routes)
        })
      }
    } else {
      this.nextStep()
    }
  }

  /**
   * Store the formApi on the component context to make it available at this.formApi.
   */
  setFormApi = formApi => {
    this.formApi = formApi
  }

  /**
   * Focus the payReq input.
   */
  focusPayReqInput = () => {
    if (this.payReqInput.current) {
      this.payReqInput.current.focus()
    }
  }

  /**
   * Focus the amount input.
   */
  focusAmountInput = () => {
    if (this.amountInput.current) {
      this.amountInput.current.focus()
    }
  }

  /**
   * Liost of enabled form steps.
   */
  steps = () => {
    const { isLn, isOnchain, invoice } = this.state
    let steps = ['address']
    if (isLn) {
      // If we have an invoice and the invoice has an amount, this is a 2 step form.
      if (invoice && invoice.satoshis) {
        steps.push('summary')
      }
      // Othersise, it will be a three step process.
      else {
        steps = ['address', 'amount', 'summary']
      }
    } else if (isOnchain) {
      steps = ['address', 'amount', 'summary']
    }
    return steps
  }

  /**
   * Go back to previous form step.
   */
  previousStep = () => {
    const { currentStep } = this.state
    const nextStep = Math.max(this.steps().indexOf(currentStep) - 1, 0)
    if (currentStep !== nextStep) {
      this.setState({ currentStep: this.steps()[nextStep], previousStep: currentStep })
    }
  }

  /**
   * Progress to next form step.
   */
  nextStep = () => {
    const { currentStep } = this.state
    const nextStep = Math.min(this.steps().indexOf(currentStep) + 1, this.steps().length - 1)
    if (currentStep !== nextStep) {
      this.setState({ currentStep: this.steps()[nextStep], previousStep: currentStep })
    }
  }

  /**
   * Set isLn/isOnchain state based on payReq value.
   */
  handlePayReqChange = () => {
    const { chain, network } = this.props
    const payReq = this.formApi.getValue('payReq')
    const state = {
      isLn: null,
      isOnchain: null,
      invoice: null
    }

    // See if the user has entered a valid lightning payment request.
    if (isLn(payReq, chain, network)) {
      let invoice
      try {
        invoice = decodePayReq(payReq)
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

  /**
   * set the amountFiat field whenever the crypto amount changes.
   */
  handleAmountCryptoChange = e => {
    const { cryptoCurrency, currentTicker, fiatCurrency } = this.props
    const lastPrice = currentTicker[fiatCurrency]
    const value = convert(cryptoCurrency, 'fiat', e.target.value, lastPrice)
    this.formApi.setValue('amountFiat', value)
  }

  /**
   * set the amountCrypto field whenever the fiat amount changes.
   */
  handleAmountFiatChange = e => {
    const { cryptoCurrency, currentTicker, fiatCurrency } = this.props
    const lastPrice = currentTicker[fiatCurrency]
    const value = convert('fiat', cryptoCurrency, e.target.value, lastPrice)
    this.formApi.setValue('amountCrypto', value)
  }

  /**
   * Handle changes from the crypto currency dropdown.
   */
  handleCryptoCurrencyChange = value => {
    const { setCryptoCurrency } = this.props
    setCryptoCurrency(value)
  }

  /**
   * Handle changes from the fiat currency dropdown.
   */
  handleFiatCurrencyChange = value => {
    const { setFiatCurrency } = this.props
    setFiatCurrency(value)
  }

  renderHelpText = () => {
    const { initialPayReq } = this.props
    const { currentStep, previousStep } = this.state

    // Do not render the help text if the form has just loadad with an initial payment request.
    if (initialPayReq && !previousStep) {
      return null
    }

    return (
      <Transition
        native
        items={currentStep === 'address'}
        from={{ opacity: 0, height: 0 }}
        enter={{ opacity: 1, height: 80 }}
        leave={{ opacity: 0, height: 0 }}
        initial={{ opacity: 1, height: 80 }}
      >
        {show =>
          show &&
          (styles => (
            <animated.div style={styles}>
              <Box mb={4}>
                <Text textAlign="justify">
                  <FormattedMessage {...messages.description} />
                </Text>
              </Box>
            </animated.div>
          ))
        }
      </Transition>
    )
  }

  renderAddressField = () => {
    const { currentStep, isLn } = this.state
    const { chain, initialPayReq, network } = this.props
    return (
      <Box className={currentStep !== 'summary' ? 'element-show' : 'element-hide'}>
        <Box pb={2}>
          <Label htmlFor="payReq" readOnly={currentStep !== 'address'}>
            {currentStep === 'address' ? (
              <FormattedMessage {...messages.request_label_combined} />
            ) : isLn ? (
              <FormattedMessage {...messages.request_label_offchain} />
            ) : (
              <FormattedMessage {...messages.request_label_onchain} />
            )}
          </Label>
        </Box>

        <ShowHidePayReq state={currentStep === 'address' || isLn ? 'big' : 'small'} context={this}>
          {styles => (
            <React.Fragment>
              <LightningInvoiceInput
                field="payReq"
                name="payReq"
                style={styles}
                initialValue={initialPayReq}
                required
                chain={chain}
                network={network}
                validateOnBlur
                validateOnChange
                onChange={this.handlePayReqChange}
                width={1}
                readOnly={currentStep !== 'address'}
                forwardedRef={this.payReqInput}
                css={{
                  resize: 'vertical',
                  'min-height': '48px'
                }}
              />
            </React.Fragment>
          )}
        </ShowHidePayReq>
      </Box>
    )
  }

  renderAmountFields = () => {
    const { currentStep } = this.state
    const {
      cryptoCurrency,
      cryptoCurrencies,
      currentTicker,
      fiatCurrency,
      fiatCurrencies,
      initialAmountCrypto,
      initialAmountFiat
    } = this.props

    return (
      <ShowHideAmount
        state={currentStep === 'amount' ? 'show' : currentStep === 'address' ? 'hide' : 'remove'}
        context={this}
      >
        {styles => (
          <Box style={styles}>
            <Bar my={3} />
            <Label htmlFor="amountCrypto" pb={2}>
              <FormattedMessage {...messages.amount} />
            </Label>

            <Flex justifyContent="space-between" alignItems="flex-start" mb={3}>
              <Flex width={6 / 13}>
                <Box width={150}>
                  <CryptoAmountInput
                    field="amountCrypto"
                    name="amountCrypto"
                    initialValue={initialAmountCrypto}
                    currency={cryptoCurrency}
                    required
                    width={150}
                    validateOnChange
                    validateOnBlur
                    onChange={this.handleAmountCryptoChange}
                    forwardedRef={this.amountInput}
                    disabled={currentStep !== 'amount'}
                  />
                </Box>
                <Dropdown
                  activeKey={cryptoCurrency}
                  items={cryptoCurrencies}
                  onChange={this.handleCryptoCurrencyChange}
                  mt={2}
                  ml={2}
                />
              </Flex>
              <Text textAlign="center" mt={3} width={1 / 11}>
                =
              </Text>
              <Flex width={6 / 13}>
                <Box width={150} ml="auto">
                  <FiatAmountInput
                    field="amountFiat"
                    name="amountFiat"
                    initialValue={initialAmountFiat}
                    currency={fiatCurrency}
                    currentTicker={currentTicker}
                    width={150}
                    onChange={this.handleAmountFiatChange}
                    disabled={currentStep !== 'amount'}
                  />
                </Box>

                <Dropdown
                  activeKey={fiatCurrency}
                  items={fiatCurrencies}
                  onChange={this.handleFiatCurrencyChange}
                  mt={2}
                  ml={2}
                />
              </Flex>
            </Flex>
          </Box>
        )}
      </ShowHideAmount>
    )
  }

  renderSummary = () => {
    const { currentStep, isOnchain } = this.state
    const {
      cryptoCurrency,
      cryptoCurrencyTicker,
      cryptoCurrencies,
      currentTicker,
      fiatCurrency,
      isQueryingFees,
      isQueryingRoutes,
      nodes,
      onchainFees,
      queryFees,
      routes,
      setCryptoCurrency
    } = this.props

    const formState = this.formApi.getState()
    let minFee, maxFee
    if (routes.length) {
      minFee = getMinFee(routes)
      maxFee = getMaxFee(routes)
    }

    const render = () => {
      // convert entered amount to satoshis
      const amountInSatoshis = convert(cryptoCurrency, 'sats', formState.values.amountCrypto)

      if (isOnchain) {
        return (
          <PaySummaryOnChain
            mt={-3}
            amount={amountInSatoshis}
            address={formState.values.payReq}
            cryptoCurrency={cryptoCurrency}
            cryptoCurrencyTicker={cryptoCurrencyTicker}
            cryptoCurrencies={cryptoCurrencies}
            currentTicker={currentTicker}
            setCryptoCurrency={setCryptoCurrency}
            fiatCurrency={fiatCurrency}
            isQueryingFees={isQueryingFees}
            onchainFees={onchainFees}
            queryFees={queryFees}
          />
        )
      } else if (isLn) {
        return (
          <PaySummaryLightning
            mt={-3}
            currentTicker={currentTicker}
            cryptoCurrency={cryptoCurrency}
            cryptoCurrencyTicker={cryptoCurrencyTicker}
            cryptoCurrencies={cryptoCurrencies}
            fiatCurrency={fiatCurrency}
            isQueryingRoutes={isQueryingRoutes}
            minFee={minFee}
            maxFee={maxFee}
            nodes={nodes}
            payReq={formState.values.payReq}
            amount={amountInSatoshis}
            setCryptoCurrency={setCryptoCurrency}
          />
        )
      }
    }

    return (
      <Transition
        native
        items={currentStep === 'summary'}
        from={{ opacity: 0, height: 0 }}
        enter={{ opacity: 1, height: 'auto' }}
        leave={{ opacity: 0, height: 0 }}
        initial={{ opacity: 1, height: 'auto' }}
      >
        {show => show && (styles => <animated.div style={styles}>{render()}</animated.div>)}
      </Transition>
    )
  }

  /**
   * Form renderer.
   */
  render() {
    const { currentStep, invoice, isLn, isOnchain } = this.state
    const {
      chain,
      network,
      channelBalance,
      cryptoCurrency,
      cryptoCurrencyTicker,
      cryptoCurrencies,
      currentTicker,
      cryptoName,
      fiatCurrencies,
      fiatCurrency,
      initialPayReq,
      initialAmountCrypto,
      initialAmountFiat,
      isProcessing,
      isQueryingFees,
      isQueryingRoutes,
      onchainFees,
      payInvoice,
      sendCoins,
      setCryptoCurrency,
      setFiatCurrency,
      queryFees,
      queryRoutes,
      routes,
      walletBalance,
      ...rest
    } = this.props
    return (
      <Form
        width={1}
        css={{ height: '100%' }}
        {...rest}
        getApi={this.setFormApi}
        onSubmit={this.onSubmit}
      >
        {({ formState }) => {
          // Deterine which buttons should be visible.
          const showBack = currentStep !== 'address'
          const showSubmit = currentStep !== 'address' || (isOnchain || isLn)

          let amountInSatoshis = formState.values.amountCrypto
          if (isLn) {
            amountInSatoshis =
              invoice.satoshis || convert(cryptoCurrency, 'sats', formState.values.amountCrypto)
          }

          // Determine wether we have enough funds available.
          let hasEnoughFunds = true
          if (isLn && invoice) {
            hasEnoughFunds = amountInSatoshis <= channelBalance
          } else if (isOnchain) {
            hasEnoughFunds = amountInSatoshis <= walletBalance
          }

          // Determine what the text should be for the next button.
          let nextButtonText = <FormattedMessage {...messages.next} />
          if (currentStep === 'summary') {
            nextButtonText = (
              <>
                <FormattedMessage {...messages.send} />
                {` `}
                <Value value={amountInSatoshis} currency={cryptoCurrency} />
                {` `}
                {cryptoCurrencyTicker}
              </>
            )
          }
          return (
            <Panel>
              <Panel.Header>
                <PayHeader
                  title={
                    <>
                      <FormattedMessage {...messages.send} /> {cryptoName} ({cryptoCurrencyTicker})
                    </>
                  }
                  type={isLn ? 'offchain' : isOnchain ? 'onchain' : null}
                />
                <Bar pt={2} />
              </Panel.Header>

              <Panel.Body py={3}>
                {this.renderHelpText()}
                {this.renderAddressField()}
                {this.renderAmountFields()}
                {this.renderSummary()}
              </Panel.Body>
              <Panel.Footer>
                <ShowHideButtons state={showBack || showSubmit ? 'show' : 'show'}>
                  {styles => (
                    <Box style={styles}>
                      {currentStep === 'summary' &&
                        !hasEnoughFunds && (
                          <Message variant="error" justifyContent="center" mb={2}>
                            <FormattedMessage {...messages.error_not_enough_funds} />
                          </Message>
                        )}

                      <PayButtons
                        disabled={
                          formState.pristine ||
                          formState.invalid ||
                          isProcessing ||
                          (currentStep === 'summary' && !hasEnoughFunds)
                        }
                        nextButtonText={nextButtonText}
                        processing={isProcessing}
                        showBack={showBack}
                        showSubmit={showSubmit}
                        previousStep={this.previousStep}
                      />

                      {walletBalance !== null && (
                        <React.Fragment>
                          <Text textAlign="center" mt={3} fontWeight="normal">
                            <FormattedMessage {...messages.current_balance} />:
                          </Text>
                          <Text textAlign="center" fontSize="xs">
                            {convert('sats', cryptoCurrency, walletBalance)}
                            {` `}
                            {cryptoCurrencyTicker} (onchain),
                          </Text>
                          <Text textAlign="center" fontSize="xs">
                            {convert('sats', cryptoCurrency, channelBalance)}
                            {` `}
                            {cryptoCurrencyTicker} (in channels)
                          </Text>
                        </React.Fragment>
                      )}
                    </Box>
                  )}
                </ShowHideButtons>
              </Panel.Footer>
            </Panel>
          )
        }}
      </Form>
    )
  }
}

export default Pay
