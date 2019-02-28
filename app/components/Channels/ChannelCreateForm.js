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
  Radio,
  RadioGroup,
  Span,
  Spinner,
  Text,
  Toggle
} from 'components/UI'
import { CurrencyFieldGroup, CryptoValue, CryptoSelector } from 'containers/UI'
import Padlock from 'components/Icon/Padlock'
import ChannelBackButton from './ChannelBackButton'
import ChannelCreateSummary from './ChannelCreateSummary'

import messages from './messages'
import {
  TRANSACTION_SPEED_SLOW,
  TRANSACTION_SPEED_MEDIUM,
  TRANSACTION_SPEED_FAST
} from './constants'

const speeds = [TRANSACTION_SPEED_SLOW, TRANSACTION_SPEED_MEDIUM, TRANSACTION_SPEED_FAST]
const defaultSpeed = TRANSACTION_SPEED_SLOW

/**
 * Animation to handle showing/hiding the amount fields.
 */
const ShowHide = Keyframes.Spring({
  show: async next => {
    await next({ pointerEvents: 'auto' })
    await next({ opacity: 1 })
  },
  hide: { opacity: 0, pointerEvents: 'none' }
})

const FormButtons = ({ isNextButtonDisabled, nextButtonText, onBack }) => (
  <Flex alignItems="center" mb={3}>
    <Box width={1 / 4}>
      <ChannelBackButton onClick={onBack} mr="auto" />
    </Box>
    <Flex width={2 / 4} justifyContent="center">
      <Button type="submit" disabled={isNextButtonDisabled}>
        {nextButtonText}
      </Button>
    </Flex>
  </Flex>
)

FormButtons.propTypes = {
  isNextButtonDisabled: PropTypes.bool,
  nextButtonText: PropTypes.node.isRequired,
  onBack: PropTypes.func.isRequired
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
  walletBalance: PropTypes.number.isRequired,
  currencyName: PropTypes.string.isRequired
}

class ChannelCreateForm extends React.Component {
  state = {
    step: 'form'
  }

  static propTypes = {
    intl: intlShape.isRequired,
    activeWalletSettings: PropTypes.shape({
      type: PropTypes.string.isRequired
    }).isRequired,
    walletBalance: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    currencyName: PropTypes.string.isRequired,
    isQueryingFees: PropTypes.bool,
    onchainFees: PropTypes.shape({
      fastestFee: PropTypes.number,
      halfHourFee: PropTypes.number,
      hourFee: PropTypes.number
    }),
    onSubmit: PropTypes.func.isRequired,
    openChannel: PropTypes.func.isRequired,
    queryFees: PropTypes.func.isRequired,
    searchQuery: PropTypes.string,
    selectedNodeDisplayName: PropTypes.string,
    showNotification: PropTypes.func.isRequired,
    updateContactFormSearchQuery: PropTypes.func.isRequired
  }

  static defaultProps = {
    isQueryingFees: false,
    onchainFees: {}
  }

  componentDidMount() {
    const { queryFees } = this.props
    queryFees()
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
    const { speed = defaultSpeed } = values
    const satPerByte = this.getFeeRate(speed)

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
   * Get the current per byte fee based on the form values.
   */
  getFee = () => {
    const formState = this.formApi.getState()
    const { speed = defaultSpeed } = formState.values
    return this.getFeeRate(speed)
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
    const { speed = defaultSpeed } = formState.values
    const fee = this.getFeeRate(speed)

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
          required
          validateOnChange
          validateOnBlur
          disabled={Boolean(searchQuery)}
        />

        <Bar my={3} opacity={0.3} />

        <CurrencyFieldGroup
          formApi={this.formApi}
          validate={this.validateAmount}
          validateOnChange={formState.submits > 0}
          validateOnBlur={formState.submits > 0}
          required
          css={{ height: '88px' }}
        />

        <Bar my={3} opacity={0.3} />

        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <RadioGroup
              field="speed"
              label={intl.formatMessage({ ...messages.fee })}
              description={<FormattedMessage {...messages[speed.toLowerCase() + '_description']} />}
              required
            >
              <Flex>
                {speeds.map(speed => (
                  <Radio
                    key={speed}
                    value={speed}
                    label={<FormattedMessage {...messages[speed.toLowerCase()]} />}
                    mr={4}
                    mb={0}
                  />
                ))}
              </Flex>
            </RadioGroup>
          </Box>
          <Box>
            {isQueryingFees && (
              <Flex ml="auto" alignItems="center" justifyContent="flex-end">
                <Text mr={2}>
                  <FormattedMessage {...messages.calculating} />
                  &hellip;
                </Text>
                <Spinner color="lightningOrange" />
              </Flex>
            )}

            {!isQueryingFees && !fee && <FormattedMessage {...messages.fee_unknown} />}

            {!isQueryingFees && fee && (
              <>
                <CryptoValue value={fee} />
                <CryptoSelector mx={2} />
                <FormattedMessage {...messages.fee_per_byte} />
              </>
            )}
          </Box>
        </Flex>

        {activeWalletSettings.type !== 'local' && (
          <>
            <Bar my={3} opacity={0.3} />
            <Flex justifyContent="space-between" alignItems="center">
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
    const { speed = defaultSpeed, amountCrypto, nodePubkey } = formState.values
    const fee = this.getFeeRate(speed)
    const amount = convert(currency, 'sats', amountCrypto)

    return (
      <ChannelCreateSummary
        amount={amount}
        fee={fee}
        speed={speed}
        nodePubkey={nodePubkey}
        nodeDisplayName={selectedNodeDisplayName}
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
        initialValues={{ speed: defaultSpeed }}
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
                    <Box style={styles} css={{ position: 'absolute' }}>
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
                  isNextButtonDisabled={formState.submits > 0 && formState.invalid}
                  onBack={this.onBack}
                />
                <FormFooter walletBalance={walletBalance} currencyName={currencyName} />
              </Panel.Footer>
            </Panel>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(ChannelCreateForm)
