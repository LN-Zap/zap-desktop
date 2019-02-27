import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
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

import messages from './messages'
import {
  TRANSACTION_SPEED_SLOW,
  TRANSACTION_SPEED_MEDIUM,
  TRANSACTION_SPEED_FAST
} from './constants'

const speeds = [TRANSACTION_SPEED_SLOW, TRANSACTION_SPEED_MEDIUM, TRANSACTION_SPEED_FAST]
const defaultSpeed = TRANSACTION_SPEED_SLOW

class ChannelCreateForm extends React.Component {
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
    const speed = values.speed || defaultSpeed
    const satPerByte = this.getFeeRate(speed)

    // submit the channel to LND.
    openChannel({ pubkey, host, localamt: amountInSatoshis, satPerByte, isPrivate: values.private })

    // Notify about the new channel opening.
    showNotification(intl.formatMessage({ ...messages.open_channel_notification }))
  }

  clearSearchQuery = () => {
    const { updateContactFormSearchQuery } = this.props
    updateContactFormSearchQuery(null)
  }

  /**
   * Store the formApi on the component context to make it available at this.formApi.
   */
  setFormApi = formApi => {
    this.formApi = formApi
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
      updateContactFormSearchQuery,
      ...rest
    } = this.props

    return (
      <Form
        css={{ height: '100%' }}
        {...rest}
        getApi={this.setFormApi}
        initialValues={{
          speed: defaultSpeed
        }}
        onSubmit={values => {
          // First run our own submit handler.
          this.onSubmit(values)
          // Then run any user supplied submit handler.
          if (onSubmit) {
            onSubmit(values)
          }
        }}
      >
        {({ formState }) => {
          const speed = formState.values.speed || defaultSpeed
          const fee = this.getFeeRate(speed)

          return (
            <Panel>
              <Panel.Body>
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

                <CurrencyFieldGroup formApi={this.formApi} required />

                <Bar my={3} opacity={0.3} />

                <Flex justifyContent="space-between">
                  <Box>
                    <RadioGroup
                      field="speed"
                      label="Fee"
                      description={
                        <FormattedMessage
                          {...messages[formState.values.speed.toLowerCase() + '_description']}
                        />
                      }
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
                    {isQueryingFees ? (
                      <Flex ml="auto" alignItems="center" justifyContent="flex-end">
                        <Text mr={2}>
                          <FormattedMessage {...messages.calculating} />
                          &hellip;
                        </Text>
                        <Spinner color="lightningOrange" />
                      </Flex>
                    ) : !fee ? (
                      <FormattedMessage {...messages.fee_unknown} />
                    ) : (
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
              </Panel.Body>

              <Panel.Footer>
                <Flex alignItems="center" mb={3}>
                  <Box width={1 / 4}>
                    <ChannelBackButton onClick={this.clearSearchQuery} mr="auto" />
                  </Box>
                  <Flex width={2 / 4} justifyContent="center">
                    <Button type="submit" disabled={formState.submits > 0 && formState.invalid}>
                      <FormattedMessage {...messages.open_channel_form_next_button_text} />
                    </Button>
                  </Flex>
                </Flex>

                <Text textAlign="center">
                  <FormattedMessage {...messages.open_channel_form_onchain_balance} />
                  {` `}
                  <CryptoValue value={walletBalance} />
                  {` `}
                  {currencyName}
                </Text>
              </Panel.Footer>
            </Panel>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(ChannelCreateForm)
