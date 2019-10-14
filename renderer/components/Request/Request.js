import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import { FormattedMessage, injectIntl } from 'react-intl'
import { intlShape } from '@zap/i18n'
import { convert } from '@zap/utils/btc'
import { Bar, Button, Header, Panel, Span, Text, Tooltip, Message } from 'components/UI'
import { Form, Label, TextArea, Toggle } from 'components/Form'
import { CurrencyFieldGroup } from 'containers/Form'
import Lightning from 'components/Icon/Lightning'
import Padlock from 'components/Icon/Padlock'
import RequestSummary from './RequestSummary'
import messages from './messages'

class Request extends React.Component {
  state = {
    currentStep: 'form',
  }

  amountInput = React.createRef()

  static propTypes = {
    activeWalletSettings: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    chainName: PropTypes.string.isRequired,
    createInvoice: PropTypes.func.isRequired,
    createNewAddress: PropTypes.func.isRequired,
    cryptoUnit: PropTypes.string.isRequired,
    cryptoUnitName: PropTypes.string.isRequired,
    fetchTickers: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    invoice: PropTypes.object,
    isAnimating: PropTypes.bool,
    isProcessing: PropTypes.bool,
    maxOneTimeReceive: PropTypes.number.isRequired,
    payReq: PropTypes.string,
    showError: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    willUseFallback: PropTypes.bool,
  }

  componentDidUpdate(prevProps) {
    const { payReq } = this.props
    const { currentStep } = this.state
    if (payReq !== prevProps.payReq && currentStep === 'form') {
      this.nextStep()
    }
  }

  /**
   * getMaxOneTimeReceive - User's max one time receive capacity in `cryptoUnit`.
   *
   * @returns {number} user's max one time receive capacity in `cryptoUnit`
   * @memberof Request
   */
  getMaxOneTimeReceive() {
    const { cryptoUnit, maxOneTimeReceive, intl } = this.props
    return intl.formatNumber(convert('sats', cryptoUnit, maxOneTimeReceive), {
      maximumFractionDigits: 8,
    })
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
  onSubmit = async values => {
    const {
      cryptoUnit,
      createInvoice,
      willUseFallback,
      createNewAddress,
      intl,
      showError,
    } = this.props
    try {
      const invoiceArgs = {
        amount: values.amountCrypto,
        cryptoUnit,
        memo: values.memo,
        isPrivate: values.routingHints,
      }

      if (willUseFallback) {
        invoiceArgs.fallbackAddress = await createNewAddress()
      }

      createInvoice(invoiceArgs)
    } catch (e) {
      const message = intl.formatMessage({ ...messages.add_error })
      showError(message)
    }
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
   * isAmountAboveMax - Checks whether current requested amount is above user's max one time receive
   * capacity.
   *
   * @returns {boolean} true if requested amount is above user's max one time receive capacity
   * @memberof Request
   */
  isAmountAboveMax() {
    const { values } = this.formApi.getState()
    const { cryptoUnit, maxOneTimeReceive } = this.props
    const amountInSats = convert(cryptoUnit, 'sats', values.amountCrypto)
    return amountInSats > maxOneTimeReceive
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
    const { isAnimating } = this.props
    return (
      <CurrencyFieldGroup
        formApi={this.formApi}
        forwardedRef={this.amountInput}
        isRequired
        mb={3}
        willAutoFocus={!isAnimating}
      />
    )
  }

  renderMemoField = () => {
    const { intl } = this.props
    return (
      <TextArea
        css="resize: vertical;"
        field="memo"
        label={intl.formatMessage({ ...messages.memo })}
        mb={3}
        minHeight={48}
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
      isAnimating,
      invoice,
      payReq,
      showNotification,
      createNewAddress,
      showError,
      willUseFallback,
      maxOneTimeReceive,
      ...rest
    } = this.props
    const { currentStep } = this.state

    return (
      <Form height="100%" width={1} {...rest} getApi={this.setFormApi} onSubmit={this.onSubmit}>
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
                {currentStep === 'form' ? (
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
              {currentStep === 'form' && (
                <Panel.Footer>
                  <Flex alignItems="center" flexDirection="column">
                    {this.isAmountAboveMax() && (
                      <Message mb={2} variant="warning">
                        <FormattedMessage
                          {...messages.max_capacity_warning}
                          values={{
                            capacity: this.getMaxOneTimeReceive(),
                            unit: cryptoUnitName,
                          }}
                        />
                      </Message>
                    )}
                    <Button
                      isDisabled={formState.pristine || formState.invalid || isProcessing}
                      isProcessing={isProcessing}
                      mx="auto"
                      type="submit"
                    >
                      {nextButtonText}
                    </Button>
                  </Flex>
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
