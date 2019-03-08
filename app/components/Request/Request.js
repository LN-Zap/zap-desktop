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
    currentStep: 'form',
  }

  static propTypes = {
    /** Currently selected cryptocurrency (key). */
    createInvoice: PropTypes.func.isRequired,
    /** Human readable chain name */
    cryptoCurrency: PropTypes.string.isRequired,
    /** Ticker symbol of the currently selected cryptocurrency. */
    cryptoCurrencyTicker: PropTypes.string.isRequired,
    /** Boolean indicating wether the form is being processed. If true, form buttons are disabled. */
    cryptoName: PropTypes.string.isRequired,
    /** Lnd invoice object for the payment request */
    intl: intlShape.isRequired,
    /** Lightning Payment request. */
    invoice: PropTypes.object,
    /** Show a notification */
    isProcessing: PropTypes.bool,
    /** Create an invoice using the supplied details */
    payReq: PropTypes.string,
    showNotification: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isProcessing: false,
    payReq: null,
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
      <CurrencyFieldGroup
        formApi={this.formApi}
        forwardedRef={this.amountInput}
        isRequired
        mb={3}
      />
    )
  }

  renderMemoField = () => {
    const { intl } = this.props
    return (
      <TextArea
        css={{ resize: 'vertical', 'min-height': '48px' }}
        field="memo"
        label={intl.formatMessage({ ...messages.memo })}
        name="memo"
        placeholder={intl.formatMessage({ ...messages.memo_placeholder })}
        rows={3}
        tooltip={intl.formatMessage({ ...messages.memo_tooltip })}
        validateOnBlur
        validateOnChange
        width={1}
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
        css={{ height: '100%' }}
        width={1}
        {...rest}
        getApi={this.setFormApi}
        onSubmit={this.onSubmit}
      >
        {({ formState }) => {
          // Determine what the text should be for the next button.
          let nextButtonText = intl.formatMessage({ ...messages.button_text })
          if (formState.values.amountCrypto) {
            nextButtonText = `${intl.formatMessage({
              ...messages.button_text,
            })} ${formState.values.amountCrypto} ${cryptoCurrencyTicker}`
          }

          return (
            <Panel>
              <Panel.Header>
                <Header
                  logo={<Lightning height="45px" width="45px" />}
                  subtitle={<FormattedMessage {...messages.subtitle} />}
                  title={`${intl.formatMessage({
                    ...messages.title,
                  })} ${cryptoName} (${cryptoCurrencyTicker})`}
                />
                <Bar mt={2} />
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
                    invoice={invoice}
                    mt={-3}
                    payReq={payReq}
                    showNotification={showNotification}
                  />
                )}
              </Panel.Body>
              {currentStep == 'form' && (
                <Panel.Footer>
                  <Text textAlign="center">
                    <Button
                      isDisabled={formState.pristine || formState.invalid || isProcessing}
                      isProcessing={isProcessing}
                      mx="auto"
                      type="submit"
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
