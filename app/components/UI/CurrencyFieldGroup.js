import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import { convert } from 'lib/utils/btc'
import CryptoAmountInput from './CryptoAmountInput'
import Dropdown from './Dropdown'
import FiatAmountInput from './FiatAmountInput'
import messages from './messages'

class CurrencyFieldGroup extends React.Component {
  static propTypes = {
    /** Current ticker data as provided by blockchain.info */
    currentTicker: PropTypes.object.isRequired,
    /** Currently selected cryptocurrency (key). */
    cryptoCurrency: PropTypes.string.isRequired,
    /** List of supported cryptocurrencies. */
    cryptoCurrencies: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    /** Boolean indicating if form fields are disabled */
    disabled: PropTypes.bool,
    /** List of supported fiat currencies. */
    fiatCurrencies: PropTypes.array.isRequired,
    /** Currently selected fiat currency (key). */
    fiatCurrency: PropTypes.string.isRequired,
    /** FormApi */
    formApi: PropTypes.object.isRequired,
    /** forward ref for amount crypto field */
    forwardedRef: PropTypes.object,
    /** Amount value to populate the amountCrypto field with when the form first loads. */
    initialAmountCrypto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Amount value to populate the amountFiat field with when the form first loads. */
    initialAmountFiat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Boolean indicating if form fields are required */
    required: PropTypes.bool,
    /** Additional field validation */
    validate: PropTypes.func.isRequired,
    /** Boolean indicating if form fields should validate on blur */
    validateOnBlur: PropTypes.bool,
    /** Boolean indicating if form fields should validate on change */
    validateOnChange: PropTypes.bool,
    /** Set the current cryptocurrency. */
    setCryptoCurrency: PropTypes.func.isRequired,
    /** Set the current fiat currency */
    setFiatCurrency: PropTypes.func.isRequired
  }

  static defaultProps = {
    disabled: false,
    initialAmountCrypto: null,
    initialAmountFiat: null,
    validateOnBlur: true,
    validateOnChange: true
  }

  /**
   * set the amountFiat field whenever the crypto amount changes.
   */
  handleAmountCryptoChange = e => {
    const { cryptoCurrency, currentTicker, formApi, fiatCurrency } = this.props
    const lastPrice = currentTicker[fiatCurrency]
    const value = convert(cryptoCurrency, 'fiat', e.target.value, lastPrice)
    formApi.setValue('amountFiat', value)
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
      disabled,
      fiatCurrency,
      fiatCurrencies,
      initialAmountCrypto,
      initialAmountFiat,
      required,
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
                field="amountCrypto"
                name="amountCrypto"
                initialValue={initialAmountCrypto}
                currency={cryptoCurrency}
                required={required}
                label={<FormattedMessage {...messages.amount} />}
                width={150}
                validate={validate}
                validateOnBlur={validateOnBlur}
                validateOnChange={validateOnChange}
                onChange={this.handleAmountCryptoChange}
                forwardedRef={this.forwardedRef}
                disabled={disabled}
              />
            </Box>
            <Dropdown
              activeKey={cryptoCurrency}
              items={cryptoCurrencies}
              onChange={this.handleCryptoCurrencyChange}
              mt={36}
              ml={2}
            />
          </Flex>
          <Flex justifyContent="center" width={1 / 11} mt={38}>
            =
          </Flex>
          <Flex width={6 / 13}>
            <Box width={150} ml="auto">
              <FiatAmountInput
                field="amountFiat"
                name="amountFiat"
                initialValue={initialAmountFiat}
                currency={fiatCurrency}
                currentTicker={currentTicker}
                label="&nbsp;"
                width={150}
                onChange={this.handleAmountFiatChange}
                disabled={disabled}
              />
            </Box>

            <Dropdown
              activeKey={fiatCurrency}
              items={fiatCurrencies}
              onChange={this.handleFiatCurrencyChange}
              mt={36}
              ml={2}
            />
          </Flex>
        </Flex>
      </Box>
    )
  }
}

export default CurrencyFieldGroup
