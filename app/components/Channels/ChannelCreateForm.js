import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box, Flex } from 'rebass'
import { convert } from 'lib/utils/btc'
import { Bar, Button, Form, Header, NodePubkeyInput, Panel, Text } from 'components/UI'
import { CurrencyFieldGroup, CryptoValue } from 'containers/UI'
import LightningChannel from 'components/Icon/LightningChannel'
import messages from './messages'

class ChannelCreateForm extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    channelBalance: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    currencyName: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    openChannel: PropTypes.func.isRequired
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

    // submit the channel to LND
    openChannel({ pubkey, host, localamt: amountInSatoshis })
  }

  /**
   * Store the formApi on the component context to make it available at this.formApi.
   */
  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { intl, channelBalance, currencyName, onSubmit, openChannel, ...rest } = this.props

    return (
      <Form
        css={{ height: '100%' }}
        {...rest}
        getApi={this.setFormApi}
        onSubmit={values => {
          // First run our own submit handler.
          this.onSubmit(values)
          // Then run any user supplied submit handler.
          if (onSubmit) {
            onSubmit(values)
          }
        }}
      >
        {({ formState }) => (
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
              <Box mb={4}>
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
        )}
      </Form>
    )
  }
}

export default injectIntl(ChannelCreateForm)
