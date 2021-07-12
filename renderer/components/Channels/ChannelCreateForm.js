import React from 'react'

import get from 'lodash/get'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Keyframes } from 'react-spring/renderprops.cjs'
import { Box, Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { convert } from '@zap/utils/btc'
import { CoinBig } from '@zap/utils/coin'
import {
  Form,
  NodePubkeyInput,
  Label,
  Toggle,
  TransactionFeeInput,
  // IntegerInput,
} from 'components/Form'
import Padlock from 'components/Icon/Padlock'
import { Bar, Button, Panel, Span, Text } from 'components/UI'
import { CurrencyFieldGroup } from 'containers/Form'
import { CryptoValue } from 'containers/UI'

import ChannelBackButton from './ChannelBackButton'
import ChannelCreateSummary from './ChannelCreateSummary'
import {
  TRANSACTION_SPEED_SLOW,
  TRANSACTION_SPEED_MEDIUM,
  TRANSACTION_SPEED_FAST,
} from './constants'
import messages from './messages'

/**
 * Animation to handle showing/hiding the amount fields.
 */
const ShowHide = Keyframes.Spring({
  show: async (next, cancel, ownProps) => {
    await next({ pointerEvents: 'auto' })
    await next({ opacity: 1 })
    // Focus the amount input if the current step is the form step.
    if (ownProps.context.state.step === 'form') {
      ownProps.context.focusAmountInput()
    }
  },
  hide: { opacity: 0, pointerEvents: 'none' },
})

const FormButtons = ({ isNextButtonDisabled, nextButtonText, onBack }) => (
  <Flex alignItems="center" mb={3}>
    <Box width={1 / 6}>
      <ChannelBackButton mr="auto" onClick={onBack} />
    </Box>
    <Flex justifyContent="center" width={4 / 6}>
      <Button isDisabled={isNextButtonDisabled} type="submit">
        {nextButtonText}
      </Button>
    </Flex>
  </Flex>
)

FormButtons.propTypes = {
  isNextButtonDisabled: PropTypes.bool,
  nextButtonText: PropTypes.node.isRequired,
  onBack: PropTypes.func.isRequired,
}

const FormFooter = ({ walletBalance, cryptoUnitName }) => (
  <Box>
    <Text textAlign="center">
      <FormattedMessage {...messages.open_channel_form_onchain_balance} />
      &nbsp;
      <CryptoValue value={walletBalance} />
      &nbsp;
      {cryptoUnitName}
    </Text>
  </Box>
)

FormFooter.propTypes = {
  cryptoUnitName: PropTypes.string.isRequired,
  walletBalance: PropTypes.string.isRequired,
}

class ChannelCreateForm extends React.Component {
  state = {
    step: 'form',
    isSubmitComplete: false, // if we have succesfully initiated channel opening
  }

  amountInput = React.createRef()

  static propTypes = {
    activeWalletSettings: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    cryptoUnit: PropTypes.string.isRequired,
    cryptoUnitName: PropTypes.string.isRequired,
    fetchTickers: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    isQueryingFees: PropTypes.bool,
    lndTargetConfirmations: PropTypes.shape({
      fast: PropTypes.number.isRequired,
      medium: PropTypes.number.isRequired,
      slow: PropTypes.number.isRequired,
    }).isRequired,
    onchainFees: PropTypes.shape({
      fast: PropTypes.string,
      medium: PropTypes.string,
      slow: PropTypes.string,
    }),
    onSubmit: PropTypes.func.isRequired,
    openChannel: PropTypes.func.isRequired,
    queryFees: PropTypes.func.isRequired,
    searchQuery: PropTypes.string,
    selectedNodeDisplayName: PropTypes.string,
    updateContactFormSearchQuery: PropTypes.func.isRequired,
    walletBalance: PropTypes.string.isRequired,
  }

  static defaultProps = {
    onchainFees: {},
  }

  componentDidMount() {
    const { fetchTickers, queryFees } = this.props
    fetchTickers()
    queryFees()
  }

  // focusAmountInput Focus the amount input.
  focusAmountInput = () => {
    if (this.amountInput.current) {
      this.amountInput.current.focus()
    }
  }

  // Get the current per byte fee based on the form values.
  getFee = () => {
    const formState = this.formApi.getState()
    const { speed } = formState.values
    return this.getFeeRate(speed)
  }

  getFeeRate = speed => {
    const { onchainFees } = this.props

    switch (speed) {
      case TRANSACTION_SPEED_SLOW:
        return get(onchainFees, 'slow', null)
      case TRANSACTION_SPEED_MEDIUM:
        return get(onchainFees, 'medium', null)
      case TRANSACTION_SPEED_FAST:
        return get(onchainFees, 'fast', null)
      default:
        return null
    }
  }

  handleSubmit = values => {
    const { onSubmit } = this.props
    const { step } = this.state

    if (step === 'form') {
      this.setState({ step: 'summary' })
      return
    }
    // set submitted flag to prevent multiple submissions
    this.setState({
      isSubmitComplete: true,
    })
    // Run our submit handler.
    this.onSubmit(values)
    // Then run any user supplied submit handler.
    if (onSubmit) {
      onSubmit(values)
    }
  }

  onBack = () => {
    const { step } = this.state
    if (step === 'form') {
      this.clearSearchQuery()
    } else {
      this.setState({ step: 'form' })
    }
  }

  // Open a channel using the supplied details.
  onSubmit = values => {
    const { cryptoUnit, openChannel } = this.props
    const { amountCrypto, nodePubkey, remoteCsvDelay, private: isPrivate } = values

    // Convert amount to satoshis.
    const amountInSatoshis = convert(cryptoUnit, 'sats', amountCrypto)

    // Extract node details.
    const [pubkey, host] = nodePubkey.split('@')

    // Determine the fee rate to use.
    const satPerByte = this.getFee()

    // submit the channel to LND.
    openChannel({
      pubkey,
      host,
      localamt: amountInSatoshis,
      satPerByte,
      isPrivate,
      remoteCsvDelay,
    })
  }

  // Clear the current search query.
  clearSearchQuery = () => {
    const { updateContactFormSearchQuery } = this.props
    updateContactFormSearchQuery(null)
  }

  // Custom validation for the amount input.
  validateAmount = value => {
    if (!value) {
      return
    }

    const { intl, cryptoUnit, walletBalance } = this.props
    const fee = this.getFee()
    const amount = convert(cryptoUnit, 'sats', value)

    // FIXME: The fee here is a per byte fee, however what we really need is the projected fee for the transaction.
    // This is not currently available in lnd, but will be in it's upcoming fee estimation API.
    const totalAmount = amount + fee

    if (CoinBig(totalAmount).gt(walletBalance)) {
      intl.formatMessage({ ...messages.error_not_enough_funds })
    }
  }

  // Store the formApi on the component context to make it available at this.formApi.
  setFormApi = formApi => {
    this.formApi = formApi
  }

  renderFormFields() {
    const {
      intl,
      activeWalletSettings,
      isQueryingFees,
      lndTargetConfirmations,
      searchQuery,
    } = this.props

    const formState = this.formApi.getState()
    const { speed } = formState.values
    const fee = this.getFee(speed)

    return (
      <Box>
        <Box mb={3}>
          <Text textAlign="justify">
            <FormattedMessage {...messages.open_channel_form_description} />
          </Text>
        </Box>

        <NodePubkeyInput
          field="nodePubkey"
          initialValue={searchQuery}
          isDisabled={Boolean(searchQuery)}
          isRequired
          validateOnBlur
          validateOnChange
        />

        <Bar my={3} variant="light" />

        <CurrencyFieldGroup
          formApi={this.formApi}
          forwardedRef={this.amountInput}
          height={88}
          isRequired
          validate={this.validateAmount}
          validateOnBlur={formState.submits > 0}
          validateOnChange={formState.submits > 0}
        />

        <Bar my={3} variant="light" />

        <TransactionFeeInput
          fee={fee}
          field="speed"
          isQueryingFees={isQueryingFees}
          label={intl.formatMessage({ ...messages.fee })}
          lndTargetConfirmations={lndTargetConfirmations}
          required
        />

        {activeWalletSettings.type !== 'local' && (
          <>
            <Bar my={3} variant="light" />
            <Flex alignItems="center" justifyContent="space-between">
              <Flex>
                <Span color="gray" fontSize="s" mr={2}>
                  <Padlock />
                </Span>
                <Label
                  htmlFor="private"
                  tooltip={intl.formatMessage({ ...messages.private_tooltip })}
                >
                  <FormattedMessage {...messages.private_label} />
                </Label>
              </Flex>
              <Flex>
                <Toggle field="private" />
              </Flex>
            </Flex>
          </>
        )}

        {/* <Flex alignItems="center" justifyContent="space-between" mt={2}>
          <Flex>
            <Span color="gray" fontSize="s" mr={2}>
              <Padlock />
            </Span>
            <Label
              htmlFor="remoteCsvDelay"
              tooltip={intl.formatMessage({ ...messages.remote_csv_delay_tooltip })}
            >
              <FormattedMessage {...messages.remote_csv_delay_label} />
            </Label>
          </Flex>

          <IntegerInput
            field="remoteCsvDelay"
            placeholder="auto"
            textAlign="right"
            variant="thin"
            width={80}
          />
        </Flex> */}
      </Box>
    )
  }

  renderFormSummary() {
    const { cryptoUnit, selectedNodeDisplayName, lndTargetConfirmations } = this.props

    const formState = this.formApi.getState()
    const { speed, amountCrypto, nodePubkey } = formState.values
    const fee = this.getFee()
    const amount = convert(cryptoUnit, 'sats', amountCrypto)

    return (
      <ChannelCreateSummary
        amount={amount}
        fee={fee}
        lndTargetConfirmations={lndTargetConfirmations}
        nodeDisplayName={selectedNodeDisplayName}
        nodePubkey={nodePubkey}
        speed={speed}
      />
    )
  }

  render() {
    const { walletBalance, cryptoUnitName, ...rest } = this.props
    const { step, isSubmitComplete } = this.state

    return (
      <Form height="100%" {...rest} getApi={this.setFormApi} onSubmit={this.handleSubmit}>
        {({ formState }) => {
          const { amountCrypto } = formState.values

          return (
            <Panel>
              <Panel.Body sx={{ position: 'relative' }}>
                <ShowHide context={this} state={step === 'form' ? 'show' : 'hide'}>
                  {styles => (
                    <Box sx={{ ...styles, position: 'absolute' }}>{this.renderFormFields()}</Box>
                  )}
                </ShowHide>

                <ShowHide context={this} state={step === 'summary' ? 'show' : 'hide'}>
                  {styles => (
                    <Box sx={styles}>{step === 'summary' && this.renderFormSummary()}</Box>
                  )}
                </ShowHide>
              </Panel.Body>

              <Panel.Footer>
                <FormButtons
                  isNextButtonDisabled={
                    (isSubmitComplete && step === 'summary') ||
                    (formState.submits > 0 && formState.invalid)
                  }
                  nextButtonText={
                    <FormattedMessage
                      {...messages[
                        step === 'form'
                          ? 'open_channel_form_next_button_text'
                          : 'open_channel_summary_next_button_text'
                      ]}
                      values={{
                        amount: `${amountCrypto} ${cryptoUnitName}`,
                      }}
                    />
                  }
                  onBack={this.onBack}
                />
                <FormFooter cryptoUnitName={cryptoUnitName} walletBalance={walletBalance} />
              </Panel.Footer>
            </Panel>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(ChannelCreateForm)
