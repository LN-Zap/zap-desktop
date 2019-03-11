import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Keyframes } from 'react-spring'
import get from 'lodash.get'
import { Box, Flex } from 'rebass'
import { convert } from 'lib/utils/btc'
import {
  Bar,
  Button,
  Form,
  NodePubkeyInput,
  Label,
  Panel,
  Span,
  Text,
  Toggle,
  TransactionFeeInput,
} from 'components/UI'
import { CurrencyFieldGroup, CryptoValue } from 'containers/UI'
import Padlock from 'components/Icon/Padlock'
import ChannelBackButton from './ChannelBackButton'
import ChannelCreateSummary from './ChannelCreateSummary'

import messages from './messages'
import {
  TRANSACTION_SPEED_SLOW,
  TRANSACTION_SPEED_MEDIUM,
  TRANSACTION_SPEED_FAST,
} from './constants'

/**
 * Animation to handle showing/hiding the amount fields.
 */
const ShowHide = Keyframes.Spring({
  show: async next => {
    await next({ pointerEvents: 'auto' })
    await next({ opacity: 1 })
  },
  hide: { opacity: 0, pointerEvents: 'none' },
})

const FormButtons = ({ isNextButtonDisabled, nextButtonText, onBack }) => (
  <Flex alignItems="center" mb={3}>
    <Box width={1 / 4}>
      <ChannelBackButton mr="auto" onClick={onBack} />
    </Box>
    <Flex justifyContent="center" width={2 / 4}>
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

const FormFooter = ({ walletBalance, currencyName }) => (
  <Box>
    <Text textAlign="center">
      <FormattedMessage {...messages.open_channel_form_onchain_balance} />
      {` `}
      <CryptoValue value={walletBalance} />
      {` `}
      {currencyName}
    </Text>
  </Box>
)

FormFooter.propTypes = {
  currencyName: PropTypes.string.isRequired,
  walletBalance: PropTypes.number.isRequired,
}

class ChannelCreateForm extends React.Component {
  state = {
    step: 'form',
  }

  static propTypes = {
    activeWalletSettings: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    currency: PropTypes.string.isRequired,
    currencyName: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    isQueryingFees: PropTypes.bool,
    onchainFees: PropTypes.shape({
      fastestFee: PropTypes.number,
      halfHourFee: PropTypes.number,
      hourFee: PropTypes.number,
    }),
    onSubmit: PropTypes.func.isRequired,
    openChannel: PropTypes.func.isRequired,
    queryFees: PropTypes.func.isRequired,
    searchQuery: PropTypes.string,
    selectedNodeDisplayName: PropTypes.string,
    showNotification: PropTypes.func.isRequired,
    updateContactFormSearchQuery: PropTypes.func.isRequired,
    walletBalance: PropTypes.number.isRequired,
  }

  static defaultProps = {
    isQueryingFees: false,
    onchainFees: {},
  }

  componentDidMount() {
    const { queryFees } = this.props
    queryFees()
  }

  /**
   * Get the current per byte fee based on the form values.
   */
  getFee = () => {
    const formState = this.formApi.getState()
    const { speed } = formState.values
    return this.getFeeRate(speed)
  }

  getFeeRate = speed => {
    const { onchainFees } = this.props

    switch (speed) {
      case TRANSACTION_SPEED_SLOW:
        return get(onchainFees, 'hourFee', null)
      case TRANSACTION_SPEED_MEDIUM:
        return get(onchainFees, 'halfHourFee', null)
      case TRANSACTION_SPEED_FAST:
        return get(onchainFees, 'fastestFee', null)
    }
  }

  handleSubmit = values => {
    const { onSubmit } = this.props
    const { step } = this.state

    if (step === 'form') {
      return this.setState({ step: 'summary' })
    }
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

  /**
   * Open a channel using the supplied details.
   */
  onSubmit = values => {
    const { currency, openChannel, showNotification, intl } = this.props
    const { amountCrypto, nodePubkey } = values

    // Convert amount to satoshis.
    const amountInSatoshis = convert(currency, 'sats', amountCrypto)

    // Extract node details.
    const [pubkey, host] = nodePubkey.split('@')

    // Determine the fee rate to use.
    const satPerByte = this.getFee()

    // submit the channel to LND.
    openChannel({ pubkey, host, localamt: amountInSatoshis, satPerByte, isPrivate: values.private })

    // Notify about the new channel opening.
    showNotification(intl.formatMessage({ ...messages.open_channel_notification }))
  }

  /**
   * Clear the current search query.
   */
  clearSearchQuery = () => {
    const { updateContactFormSearchQuery } = this.props
    updateContactFormSearchQuery(null)
  }

  /**
   * Custom validation for the amount input.
   */
  validateAmount = value => {
    if (!value) {
      return
    }

    const { intl, currency, walletBalance } = this.props
    const fee = this.getFee()
    const amount = convert(currency, 'sats', value)

    // FIXME: The fee here is a per byte fee, however what we realy need is the projected fee for the transaction.
    // This is not currently available in lnd, but will be in it's upcoming fee estimation API.
    const totalAmount = amount + fee

    if (totalAmount > walletBalance) {
      return intl.formatMessage({ ...messages.error_not_enough_funds })
    }
  }

  /**
   * Store the formApi on the component context to make it available at this.formApi.
   */
  setFormApi = formApi => {
    this.formApi = formApi
  }

  renderFormFields() {
    const { intl, activeWalletSettings, isQueryingFees, searchQuery } = this.props

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
          css={{ height: '88px' }}
          formApi={this.formApi}
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
                <Label htmlFor="private">
                  <FormattedMessage {...messages.private_label} />
                </Label>
              </Flex>
              <Flex>
                <Toggle field="private" />
              </Flex>
            </Flex>
          </>
        )}
      </Box>
    )
  }

  renderFormSummary() {
    const { currency, selectedNodeDisplayName } = this.props

    const formState = this.formApi.getState()
    const { speed, amountCrypto, nodePubkey } = formState.values
    const fee = this.getFee()
    const amount = convert(currency, 'sats', amountCrypto)

    return (
      <ChannelCreateSummary
        amount={amount}
        fee={fee}
        nodeDisplayName={selectedNodeDisplayName}
        nodePubkey={nodePubkey}
        speed={speed}
      />
    )
  }

  render() {
    const {
      intl,
      activeWalletSettings,
      walletBalance,
      currencyName,
      isQueryingFees,
      onchainFees,
      onSubmit,
      openChannel,
      queryFees,
      searchQuery,
      selectedNodeDisplayName,
      showNotification,
      updateContactFormSearchQuery,
      ...rest
    } = this.props
    const { step } = this.state

    return (
      <Form
        css={{ height: '100%' }}
        {...rest}
        getApi={this.setFormApi}
        onSubmit={this.handleSubmit}
      >
        {({ formState }) => {
          const { currency } = this.props
          const { amountCrypto } = formState.values

          return (
            <Panel>
              <Panel.Body css={{ position: 'relative' }}>
                <ShowHide state={step === 'form' ? 'show' : 'hide'}>
                  {styles => (
                    <Box css={{ position: 'absolute' }} style={styles}>
                      {this.renderFormFields()}
                    </Box>
                  )}
                </ShowHide>

                <ShowHide state={step === 'summary' ? 'show' : 'hide'}>
                  {styles => (
                    <Box style={styles}>{step === 'summary' && this.renderFormSummary()}</Box>
                  )}
                </ShowHide>
              </Panel.Body>

              <Panel.Footer>
                <FormButtons
                  isNextButtonDisabled={formState.submits > 0 && formState.invalid}
                  nextButtonText={
                    <FormattedMessage
                      {...messages[
                        step === 'form'
                          ? 'open_channel_form_next_button_text'
                          : 'open_channel_summary_next_button_text'
                      ]}
                      values={{ amount: `${amountCrypto} ${currency}` }}
                    />
                  }
                  onBack={this.onBack}
                />
                <FormFooter currencyName={currencyName} walletBalance={walletBalance} />
              </Panel.Footer>
            </Panel>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(ChannelCreateForm)
