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
  Header,
  NodePubkeyInput,
  Panel,
  Radio,
  RadioGroup,
  Spinner,
  Text
} from 'components/UI'
import { CurrencyFieldGroup, CryptoValue, CryptoSelector } from 'containers/UI'
import LightningChannel from 'components/Icon/LightningChannel'
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
    channelBalance: PropTypes.number.isRequired,
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
    queryFees: PropTypes.func.isRequired
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
    const { currency, openChannel } = this.props
    const { amountCrypto, nodePubkey } = values

    // Convert amount to satoshis.
    const amountInSatoshis = convert(currency, 'sats', amountCrypto)

    // Extract node details.
    const [pubkey, host] = nodePubkey.split('@')

    // Determine the fee rate to use.
    const speed = values.speed || defaultSpeed
    const satPerByte = this.getFeeRate(speed)

    // submit the channel to LND.
    openChannel({ pubkey, host, localamt: amountInSatoshis, satPerByte })
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
      channelBalance,
      currencyName,
      isQueryingFees,
      onchainFees,
      onSubmit,
      openChannel,
      queryFees,
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
              <Panel.Header>
                <Header
                  title={<FormattedMessage {...messages.open_channel_form_title} />}
                  subtitle={<FormattedMessage {...messages.open_channel_form_subtitle} />}
                  logo={<LightningChannel height="48px" width="48px" />}
                />
                <Bar pt={2} />
              </Panel.Header>

              <Panel.Body py={3}>
                <Box mb={3}>
                  <Text textAlign="justify">
                    <FormattedMessage {...messages.open_channel_form_description} />
                  </Text>
                </Box>

                <NodePubkeyInput
                  field="nodePubkey"
                  label={intl.formatMessage({ ...messages.remote_pubkey })}
                  required
                  validateOnChange
                  validateOnBlur
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
              </Panel.Body>

              <Panel.Footer>
                <Flex alignItems="center" justifyContent="center" mb={3}>
                  <Button type="submit" disabled={formState.submits > 0 && formState.invalid}>
                    <FormattedMessage {...messages.open_channel_form_next_button_text} />
                  </Button>
                </Flex>

                <Text textAlign="center">
                  <FormattedMessage {...messages.open_channel_form_onchain_balance} />
                  {` `}
                  <CryptoValue value={channelBalance} />
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
