import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import { convert } from '@zap/utils/btc'
import CryptoAmountInput from './CryptoAmountInput'
import Dropdown from './Dropdown'
import FiatAmountInput from './FiatAmountInput'
import messages from './messages'

class CurrencyFieldGroup extends React.Component {
  static propTypes = {
    /** Current ticker data as provided by blockchain.info */
    cryptoCurrencies: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    /** Currently selected cryptocurrency (key). */
    cryptoCurrency: PropTypes.string.isRequired,
    /** List of supported cryptocurrencies. */
    currentTicker: PropTypes.object.isRequired,
    /** Boolean indicating if form fields are disabled */
    fiatCurrencies: PropTypes.array.isRequired,
    /** List of supported fiat currencies. */
    fiatCurrency: PropTypes.string.isRequired,
    /** Currently selected fiat currency (key). */
    formApi: PropTypes.object.isRequired,
    /** FormApi */
    forwardedRef: PropTypes.object,
    /** forward ref for amount crypto field */
    initialAmountCrypto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Amount value to populate the amountCrypto field with when the form first loads. */
    initialAmountFiat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Amount value to populate the amountFiat field with when the form first loads. */
    isDisabled: PropTypes.bool,
    /** Boolean indicating if form fields are required */
    isRequired: PropTypes.bool,
    /** Additional field validation */
    setCryptoCurrency: PropTypes.func.isRequired,
    /** Boolean indicating if form fields should validate on blur */
    setFiatCurrency: PropTypes.func.isRequired,
    /** Boolean indicating if form fields should validate on change */
    validate: PropTypes.func,
    /** Set the current cryptocurrency. */
    validateOnBlur: PropTypes.bool,
    /** Set the current fiat currency */
    validateOnChange: PropTypes.bool,
  }

  static defaultProps = {
    isDisabled: false,
    initialAmountCrypto: null,
    initialAmountFiat: null,
    validateOnBlur: true,
    validateOnChange: true,
  }

  /**
   * set the amountFiat field whenever the crypto amount changes.
   */
  handleAmountCryptoChange = value => {
    const { cryptoCurrency, currentTicker, formApi, fiatCurrency } = this.props
    const lastPrice = currentTicker[fiatCurrency]
    const amount = convert(cryptoCurrency, 'fiat', value, lastPrice)
    formApi.setValue('amountFiat', amount)
  }

  /**
   * set the amountCrypto field whenever the fiat amount changes.
   */
  handleAmountFiatChange = e => {
    const { cryptoCurrency, currentTicker, formApi, fiatCurrency } = this.props
    const lastPrice = currentTicker[fiatCurrency]
    const value = convert('fiat', cryptoCurrency, e.target.value, lastPrice)
    formApi.setValue('amountCrypto', value)
  }

  /**
   * Handle changes from the crypto currency dropdown.
   */
  handleCryptoCurrencyChange = value => {
    const { setCryptoCurrency } = this.props
    setCryptoCurrency(value)
  }

  /**
   * Handle changes from the fiat currency dropdown.
   */
  handleFiatCurrencyChange = value => {
    const { setFiatCurrency } = this.props
    setFiatCurrency(value)
  }

  render() {
    const {
      cryptoCurrency,
      cryptoCurrencies,
      currentTicker,
      isDisabled,
      fiatCurrency,
      fiatCurrencies,
      initialAmountCrypto,
      initialAmountFiat,
      isRequired,
      validate,
      validateOnBlur,
      validateOnChange,
      ...rest
    } = this.props

    return (
      <Box {...rest}>
        <Flex justifyContent="space-between">
          <Flex width={6 / 13}>
            <Box width={150}>
              <CryptoAmountInput
                currency={cryptoCurrency}
                field="amountCrypto"
                forwardedRef={this.forwardedRef}
                initialValue={initialAmountCrypto}
                isDisabled={isDisabled}
                isRequired={isRequired}
                label={<FormattedMessage {...messages.amount} />}
                name="amountCrypto"
                onValueChange={this.handleAmountCryptoChange}
                validate={validate}
                validateOnBlur={validateOnBlur}
                validateOnChange={validateOnChange}
                width={150}
              />
            </Box>
            <Dropdown
              activeKey={cryptoCurrency}
              items={cryptoCurrencies}
              ml={2}
              mt={36}
              onChange={this.handleCryptoCurrencyChange}
            />
          </Flex>
          <Flex justifyContent="center" mt={38} width={1 / 11}>
            =
          </Flex>
          <Flex width={6 / 13}>
            <Box ml="auto" width={150}>
              <FiatAmountInput
                currency={fiatCurrency}
                currentTicker={currentTicker}
                field="amountFiat"
                initialValue={initialAmountFiat}
                isDisabled={isDisabled}
                label="&nbsp;"
                name="amountFiat"
                onChange={this.handleAmountFiatChange}
                width={150}
              />
            </Box>

            <Dropdown
              activeKey={fiatCurrency}
              items={fiatCurrencies}
              ml={2}
              mt={36}
              onChange={this.handleFiatCurrencyChange}
            />
          </Flex>
        </Flex>
      </Box>
    )
  }
}

export default CurrencyFieldGroup
