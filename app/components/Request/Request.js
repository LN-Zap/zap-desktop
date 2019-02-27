import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Bar, Button, Form, Header, Panel, Text, TextArea } from 'components/UI'
import { CurrencyFieldGroup } from 'containers/UI'
import Lightning from 'components/Icon/Lightning'
import RequestSummary from './RequestSummary'
import messages from './messages'

/**
 * Request form.
 */
class Request extends React.Component {
  state = {
    currentStep: 'form'
  }

  static propTypes = {
    /** Currently selected cryptocurrency (key). */
    cryptoCurrency: PropTypes.string.isRequired,
    /** Human readable chain name */
    cryptoName: PropTypes.string.isRequired,
    /** Ticker symbol of the currently selected cryptocurrency. */
    cryptoCurrencyTicker: PropTypes.string.isRequired,
    /** Boolean indicating wether the form is being processed. If true, form buttons are disabled. */
    isProcessing: PropTypes.bool,
    /** Lnd invoice object for the payment request */
    invoice: PropTypes.object,
    /** Lightning Payment request. */
    payReq: PropTypes.string,
    /** Show a notification */
    showNotification: PropTypes.func.isRequired,
    /** Create an invoice using the supplied details */
    createInvoice: PropTypes.func.isRequired,
    intl: intlShape.isRequired
  }

  static defaultProps = {
    isProcessing: false,
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

  renderHelpText = () => {
    const { cryptoName, cryptoCurrencyTicker } = this.props
    return (
      <Box mb={4}>
        <Text textAlign="justify">
          <FormattedMessage
            {...messages.description}
            values={{ chain: cryptoName, ticker: cryptoCurrencyTicker }}
          />
        </Text>
      </Box>
    )
  }

  renderAmountFields = () => {
    return (
      <CurrencyFieldGroup forwardedRef={this.amountInput} formApi={this.formApi} required mb={3} />
    )
  }

  renderMemoField = () => {
    const { intl } = this.props
    return (
      <TextArea
        field="memo"
        name="memo"
        validateOnBlur
        validateOnChange
        label={intl.formatMessage({ ...messages.memo })}
        placeholder={intl.formatMessage({ ...messages.memo_placeholder })}
        width={1}
        rows={3}
        css={{ resize: 'vertical', 'min-height': '48px' }}
      />
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
      cryptoName,
      intl,
      isProcessing,
      invoice,
      payReq,
      showNotification,
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
                    invoice={invoice}
                    payReq={payReq}
                    showNotification={showNotification}
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
