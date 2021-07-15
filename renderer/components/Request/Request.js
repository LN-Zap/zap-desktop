import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { convert } from '@zap/utils/btc'
import { CoinBig } from '@zap/utils/coin'
import { Form, Input, Label, TextArea, Toggle } from 'components/Form'
import Lightning from 'components/Icon/Lightning'
import { Bar, Button, Header, Panel, Text, Tooltip, Message } from 'components/UI'
import { CurrencyFieldGroup } from 'containers/Form'

import messages from './messages'

class Request extends React.Component {
  amountInput = React.createRef()

  static propTypes = {
    activeWalletSettings: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    addInvoice: PropTypes.func.isRequired,
    cancelInvoice: PropTypes.func.isRequired,
    chainName: PropTypes.string.isRequired,
    createNewAddress: PropTypes.func.isRequired,
    cryptoUnit: PropTypes.string.isRequired,
    cryptoUnitName: PropTypes.string.isRequired,
    fetchTickers: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    isAnimating: PropTypes.bool,
    isHoldInvoiceEnabled: PropTypes.bool,
    isProcessing: PropTypes.bool,
    maxOneTimeReceive: PropTypes.string.isRequired,
    setActivityModal: PropTypes.func.isRequired,
    settleInvoice: PropTypes.func.isRequired,
    setTopModal: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    willUseFallback: PropTypes.bool,
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
   * onSubmit - Form submit handler.
   *
   * @param {object} values submitted form values.
   */
  onSubmit = async values => {
    const {
      cryptoUnit,
      addInvoice,
      willUseFallback,
      createNewAddress,
      intl,
      setTopModal,
      setActivityModal,
      showError,
    } = this.props
    try {
      const { amountCrypto, memo, isPrivate, isHoldInvoice, preimage } = values
      const invoiceArgs = {
        amount: amountCrypto,
        cryptoUnit,
        memo,
        isPrivate,
        isHoldInvoice,
        preimage,
      }

      if (willUseFallback) {
        invoiceArgs.fallbackAddr = await createNewAddress()
      }

      const paymentRequest = await addInvoice(invoiceArgs)
      if (paymentRequest) {
        setActivityModal('INVOICE', paymentRequest)
        setTopModal('ACTIVITY_MODAL')
      }
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
    return CoinBig(amountInSats).gt(maxOneTimeReceive)
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
    const { submits } = this.formApi.getState()
    const willValidateInline = submits > 0
    return (
      <CurrencyFieldGroup
        formApi={this.formApi}
        forwardedRef={this.amountInput}
        isRequired
        mb={3}
        validateOnBlur={willValidateInline}
        validateOnChange={willValidateInline}
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
    <Flex alignItems="center" justifyContent="space-between" mb={2}>
      <Flex>
        <Flex>
          <Label htmlFor="isPrivate">
            <FormattedMessage {...messages.routing_hints_label} />
          </Label>
          <Tooltip ml={1}>
            <FormattedMessage {...messages.routing_hints_tooltip} />
          </Tooltip>
        </Flex>
      </Flex>
      <Toggle field="isPrivate" />
    </Flex>
  )

  renderHoldInvoice = () => {
    const { intl } = this.props
    const { values } = this.formApi.getState()
    return (
      <Box>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex>
            <Flex>
              <Label htmlFor="isHoldInvoice">
                <FormattedMessage {...messages.hold_invoice_label} />
              </Label>
              <Tooltip ml={1}>
                <FormattedMessage {...messages.hold_invoice_tooltip} />
              </Tooltip>
            </Flex>
          </Flex>
          <Toggle field="isHoldInvoice" />
        </Flex>
        {values.isHoldInvoice && (
          <Input
            field="preimage"
            isRequired
            mt={2}
            name="preimage"
            placeholder={intl.formatMessage({ ...messages.preimage_placeholder })}
            validateOnBlur
            validateOnChange
          />
        )}
      </Box>
    )
  }

  render() {
    const {
      activeWalletSettings,
      cryptoUnitName,
      chainName,
      intl,
      isProcessing,
      isHoldInvoiceEnabled,
      ...rest
    } = this.props

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
                {this.renderHelpText()}
                {this.renderAmountFields()}
                {this.renderMemoField()}
                {activeWalletSettings.type !== 'local' && this.renderRoutingHints()}
                {isHoldInvoiceEnabled && this.renderHoldInvoice()}
              </Panel.Body>
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
            </Panel>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(Request)
