import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage, injectIntl } from 'react-intl'
import { convert } from 'lib/utils/btc'
import {
  Bar,
  Button,
  CryptoAmountInput,
  Dropdown,
  FiatAmountInput,
  Form,
  Header,
  Label,
  Panel,
  Text,
  TextArea
} from 'components/UI'
import Lightning from 'components/Icon/Lightning'
import { RequestSummary } from '.'
import messages from './messages'

/**
 * Request form.
 */
class Request extends React.Component {
  state = {
    currentStep: 'form'
  }

  static propTypes = {
    /** Human readable chain name */
    cryptoName: PropTypes.string.isRequired,
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
    /** Boolean indicating wether the form is being processed. If true, form buttons are disabled. */
    isProcessing: PropTypes.bool,
    /** Boolean indicating wether the invoice has already been paid. */
    isPaid: PropTypes.bool,
    /** Lightning Payment request. */
    payReq: PropTypes.string,
    /** Set the current cryptocurrency. */
    setCryptoCurrency: PropTypes.func.isRequired,
    /** Set the current fiat currency */
    setFiatCurrency: PropTypes.func.isRequired,
    /** Create an invoice using the supplied details */
    createInvoice: PropTypes.func.isRequired
  }

  static defaultProps = {
    isProcessing: false,
    isPaid: false,
    payReq: null
  }

  amountInput = React.createRef()

  componentDidMount() {
    this.focusAmountInput()
  }

  componentDidUpdate(prevProps) {
    const { payReq } = this.props
    const { currentStep } = this.state
    if (payReq !== prevProps.payReq && currentStep === 'form') {
      this.nextStep()
    }
  }

  /**
   * Liost of enabled form steps.
   */
  steps = () => {
    return ['form', 'summary']
  }

  /**
   * Go back to previous form step.
   */
  previousStep = () => {
    const { currentStep } = this.state
    const nextStep = Math.max(this.steps().indexOf(currentStep) - 1, 0)
    if (currentStep !== nextStep) {
      this.setState({ currentStep: this.steps()[nextStep] })
    }
  }

  /**
   * Progress to next form step.
   */
  nextStep = () => {
    const { currentStep } = this.state
    const nextStep = Math.min(this.steps().indexOf(currentStep) + 1, this.steps().length - 1)
    if (currentStep !== nextStep) {
      this.setState({ currentStep: this.steps()[nextStep] })
    }
  }

  /**
   * Form submit handler.
   * @param  {Object} values submitted form values.
   */
  onSubmit = values => {
    const { cryptoCurrency, createInvoice } = this.props
    createInvoice(values.amountCrypto, cryptoCurrency, values.memo)
  }

  /**
   * Store the formApi on the component context to make it available at this.formApi.
   */
  setFormApi = formApi => {
    this.formApi = formApi
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
    return (
      <Box mb={4}>
        <Text textAlign="justify">
          <FormattedMessage {...messages.description} />
        </Text>
      </Box>
    )
  }

  renderAmountFields = () => {
    const {
      cryptoCurrency,
      cryptoCurrencies,
      currentTicker,
      fiatCurrency,
      fiatCurrencies
    } = this.props

    return (
      <Box>
        <Label htmlFor="amountCrypto" pb={2}>
          <FormattedMessage {...messages.amount} />
        </Label>

        <Flex justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Flex width={6 / 13}>
            <Box width={150}>
              <CryptoAmountInput
                field="amountCrypto"
                name="amountCrypto"
                currency={cryptoCurrency}
                required
                width={150}
                validateOnChange
                validateOnBlur
                onChange={this.handleAmountCryptoChange}
                forwardedRef={this.amountInput}
              />
            </Box>
            <Dropdown
              activeKey={cryptoCurrency}
              items={cryptoCurrencies}
              onChange={this.handleCryptoCurrencyChange}
              mt={3}
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
                currency={fiatCurrency}
                currentTicker={currentTicker}
                width={150}
                onChange={this.handleAmountFiatChange}
              />
            </Box>

            <Dropdown
              activeKey={fiatCurrency}
              items={fiatCurrencies}
              onChange={this.handleFiatCurrencyChange}
              mt={3}
              ml={2}
            />
          </Flex>
        </Flex>
      </Box>
    )
  }

  renderMemoField = () => {
    const { intl } = this.props
    return (
      <Box>
        <Box pb={2}>
          <Label htmlFor="memo">
            <FormattedMessage {...messages.memo} />
          </Label>
        </Box>

        <TextArea
          field="memo"
          name="memo"
          validateOnBlur
          validateOnChange
          placeholder={intl.formatMessage({ ...messages.memo_placeholder })}
          width={1}
          rows={3}
          css={{ resize: 'vertical', 'min-height': '48px' }}
        />
      </Box>
    )
  }

  /**
   * Form renderer.
   */
  render() {
    const {
      createInvoice,
      cryptoCurrency,
      cryptoCurrencyTicker,
      cryptoCurrencies,
      currentTicker,
      cryptoName,
      fiatCurrencies,
      fiatCurrency,
      intl,
      isProcessing,
      isPaid,
      payReq,
      setCryptoCurrency,
      setFiatCurrency,
      ...rest
    } = this.props
    const { currentStep } = this.state
    return (
      <Form
        width={1}
        css={{ height: '100%' }}
        {...rest}
        getApi={this.setFormApi}
        onSubmit={this.onSubmit}
      >
        {({ formState }) => {
          // Determine what the text should be for the next button.
          let nextButtonText = intl.formatMessage({ ...messages.button_text })
          if (formState.values.amountCrypto) {
            nextButtonText = `${intl.formatMessage({
              ...messages.button_text
            })} ${formState.values.amountCrypto} ${cryptoCurrencyTicker}`
          }

          return (
            <Panel>
              <Panel.Header>
                <Header
                  title={`${intl.formatMessage({
                    ...messages.title
                  })} ${cryptoName} (${cryptoCurrencyTicker})`}
                  subtitle={<FormattedMessage {...messages.subtitle} />}
                  logo={<Lightning height="45px" width="45px" />}
                />
                <Bar pt={2} />
              </Panel.Header>
              <Panel.Body py={3}>
                {currentStep == 'form' ? (
                  <React.Fragment>
                    {this.renderHelpText()}
                    {this.renderAmountFields()}
                    {this.renderMemoField()}
                  </React.Fragment>
                ) : (
                  <RequestSummary
                    mt={-3}
                    // State
                    cryptoCurrency={cryptoCurrency}
                    cryptoCurrencies={cryptoCurrencies}
                    currentTicker={currentTicker}
                    payReq={payReq}
                    isPaid={isPaid}
                    // Dispatch
                    setCryptoCurrency={setCryptoCurrency}
                    setFiatCurrency={setFiatCurrency}
                  />
                )}
              </Panel.Body>
              {currentStep == 'form' && (
                <Panel.Footer>
                  <Text textAlign="center">
                    <Button
                      type="submit"
                      disabled={formState.pristine || formState.invalid || isProcessing}
                      processing={isProcessing}
                      mx="auto"
                    >
                      {nextButtonText}
                    </Button>
                  </Text>
                </Panel.Footer>
              )}
            </Panel>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(Request)
