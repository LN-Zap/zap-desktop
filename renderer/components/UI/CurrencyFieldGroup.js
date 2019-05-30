import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import { convert } from '@zap/utils/btc'
import CryptoAmountInput from './CryptoAmountInput'
import Dropdown from './Dropdown'
import FiatAmountInput from './FiatAmountInput'
import messages from './messages'

const CurrencyFieldGroup = React.forwardRef(
  (
    {
      cryptoCurrency,
      cryptoCurrencies,
      currentTicker,
      isDisabled,
      fiatCurrency,
      fiatCurrencies,
      formApi,
      forwardedRef,
      initialAmountCrypto,
      initialAmountFiat,
      isRequired,
      setCryptoCurrency,
      setFiatCurrency,
      validate,
      validateOnBlur,
      validateOnChange,
      ...rest
    },
    ref
  ) => {
    /**
     * handleAmountCryptoChange - Set the amountFiat field whenever the crypto amount changes.
     *
     * @param {string} value Value
     */
    const handleAmountCryptoChange = value => {
      const lastPrice = currentTicker[fiatCurrency]
      const amount = convert(cryptoCurrency, 'fiat', value, lastPrice)
      formApi.setValue('amountFiat', amount)
    }

    /**
     * handleAmountFiatChange - Set the amountCrypto field whenever the fiat amount changes.
     *
     * @param {Event} e Event
     */
    const handleAmountFiatChange = e => {
      const lastPrice = currentTicker[fiatCurrency]
      const value = convert('fiat', cryptoCurrency, e.target.value, lastPrice)
      formApi.setValue('amountCrypto', value)
    }

    /**
     * handleCryptoCurrencyChange - Handle changes from the crypto currency dropdown.
     *
     * @param {string} value Value
     */
    const handleCryptoCurrencyChange = value => {
      setCryptoCurrency(value)
    }

    /**
     * handleFiatCurrencyChange - Handle changes from the fiat currency dropdown.
     *
     * @param {string} value Value
     */
    const handleFiatCurrencyChange = value => {
      setFiatCurrency(value)
    }

    return (
      <Box {...rest}>
        <Flex justifyContent="space-between">
          <Flex width={6 / 13}>
            <Box width={150}>
              <CryptoAmountInput
                currency={cryptoCurrency}
                field="amountCrypto"
                forwardedRef={ref}
                initialValue={initialAmountCrypto}
                isDisabled={isDisabled}
                isRequired={isRequired}
                label={<FormattedMessage {...messages.amount} />}
                name="amountCrypto"
                onValueChange={handleAmountCryptoChange}
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
              onChange={handleCryptoCurrencyChange}
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
                onChange={handleAmountFiatChange}
                width={150}
              />
            </Box>

            <Dropdown
              activeKey={fiatCurrency}
              items={fiatCurrencies}
              ml={2}
              mt={36}
              onChange={handleFiatCurrencyChange}
            />
          </Flex>
        </Flex>
      </Box>
    )
  }
)

CurrencyFieldGroup.displayName = 'CurrencyFieldGroup'

CurrencyFieldGroup.propTypes = {
  cryptoCurrencies: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  cryptoCurrency: PropTypes.string.isRequired,
  currentTicker: PropTypes.object.isRequired,
  fiatCurrencies: PropTypes.array.isRequired,
  fiatCurrency: PropTypes.string.isRequired,
  formApi: PropTypes.object.isRequired,
  forwardedRef: PropTypes.object,
  initialAmountCrypto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialAmountFiat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  setCryptoCurrency: PropTypes.func.isRequired,
  setFiatCurrency: PropTypes.func.isRequired,
  validate: PropTypes.func,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
}

CurrencyFieldGroup.defaultProps = {
  isDisabled: false,
  initialAmountCrypto: null,
  initialAmountFiat: null,
  validateOnBlur: true,
  validateOnChange: true,
}
export default CurrencyFieldGroup
