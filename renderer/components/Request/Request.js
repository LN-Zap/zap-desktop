import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import {
  Bar,
  Button,
  Form,
  Header,
  Label,
  Panel,
  Span,
  Text,
  TextArea,
  Toggle,
  Tooltip,
} from 'components/UI'
import { CurrencyFieldGroup } from 'containers/UI'
import Lightning from 'components/Icon/Lightning'
import Padlock from 'components/Icon/Padlock'
import RequestSummary from './RequestSummary'
import messages from './messages'

class Request extends React.Component {
  state = {
    currentStep: 'form',
  }

  static propTypes = {
    activeWalletSettings: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    chainName: PropTypes.string.isRequired,
    createInvoice: PropTypes.func.isRequired,
    cryptoUnit: PropTypes.string.isRequired,
    cryptoUnitName: PropTypes.string.isRequired,
    fetchTickers: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    invoice: PropTypes.object,
    isProcessing: PropTypes.bool,
    payReq: PropTypes.string,
    showNotification: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isProcessing: false,
    payReq: null,
  }

  amountInput = React.createRef()

  componentDidMount() {
    const { fetchTickers } = this.props
    fetchTickers()
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
   * steps - Get list of enabled form steps.
   *
   * @returns {Array} List of enabled form steps.
   */
  steps = () => {
    return ['form', 'summary']
  }

  /**
   * previousStep - Go back to previous form step.
   */
  previousStep = () => {
    const { currentStep } = this.state
    const nextStep = Math.max(this.steps().indexOf(currentStep) - 1, 0)
    if (currentStep !== nextStep) {
      this.setState({ currentStep: this.steps()[nextStep] })
    }
  }

  /**
   * nextStep - Progress to next form step.
   */
  nextStep = () => {
    const { currentStep } = this.state
    const nextStep = Math.min(this.steps().indexOf(currentStep) + 1, this.steps().length - 1)
    if (currentStep !== nextStep) {
      this.setState({ currentStep: this.steps()[nextStep] })
    }
  }

  /**
   * onSubmit - Form submit handler.
   *
   * @param  {object} values submitted form values.
   */
  onSubmit = values => {
    const { cryptoUnit, createInvoice } = this.props
    createInvoice(values.amountCrypto, cryptoUnit, values.memo, values.routingHints)
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
   * focusAmountInput - Focus the amount input.
   */
  focusAmountInput = () => {
    if (this.amountInput.current) {
      this.amountInput.current.focus()
    }
  }

  renderHelpText = () => {
    const { chainName, cryptoUnitName } = this.props
    return (
      <Text mb={4}>
        <FormattedMessage
          {...messages.description}
          values={{ chain: chainName, ticker: cryptoUnitName }}
        />
      </Text>
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
        css={`
          resize: vertical;
          min-height: 48px;
        `}
        field="memo"
        label={intl.formatMessage({ ...messages.memo })}
        mb={3}
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

  renderRoutingHints = () => (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex>
        <Span color="gray" fontSize="s" mr={2}>
          <Padlock />
        </Span>
        <Flex>
          <Label htmlFor="routingHints">
            <FormattedMessage {...messages.routing_hints_label} />
          </Label>
          <Tooltip ml={1}>
            <FormattedMessage {...messages.routing_hints_tooltip} />
          </Tooltip>
        </Flex>
      </Flex>
      <Toggle field="routingHints" />
    </Flex>
  )

  render() {
    const {
      activeWalletSettings,
      createInvoice,
      cryptoUnit,
      cryptoUnitName,
      chainName,
      fetchTickers,
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
        css={`
          height: 100%;
        `}
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
            })} ${formState.values.amountCrypto} ${cryptoUnitName}`
          }

          return (
            <Panel>
              <Panel.Header>
                <Header
                  logo={<Lightning height="45px" width="45px" />}
                  title={`${intl.formatMessage({
                    ...messages.title,
                  })} ${chainName} (${cryptoUnitName})`}
                />
                <Bar mt={2} />
              </Panel.Header>
              <Panel.Body py={3}>
                {currentStep == 'form' ? (
                  <React.Fragment>
                    {this.renderHelpText()}
                    {this.renderAmountFields()}
                    {this.renderMemoField()}
                    {activeWalletSettings.type !== 'local' && this.renderRoutingHints()}
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
