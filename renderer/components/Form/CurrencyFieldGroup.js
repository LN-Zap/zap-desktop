import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import { convert } from '@zap/utils/btc'
import CryptoAmountInput from './CryptoAmountInput'
import { Span, Dropdown } from 'components/UI'
import FiatAmountInput from './FiatAmountInput'
import messages from './messages'

const CurrencyFieldGroup = React.forwardRef(
  (
    {
      cryptoLabel,
      cryptoUnit,
      cryptoUnits,
      currentTicker,
      isDisabled,
      fiatLabel,
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
      onChange,
      willAutoFocus,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef()

    // Whether update of a linked input (crypto<->fiat) is enabled.
    // This ref is used in a process of linked value calculations to prevent circular updates.
    const blockUpdates = useRef(false)

    // Prevent updates of linked form values.
    const blockLinkedUpdates = () => {
      blockUpdates.current = true
    }

    // informed calls onValueChange multiple time during value updates
    // because of masks and patterns applied on top of UI elements
    // give value a chance to settle before enabling updates again
    const unblockLinkedUpdates = async () => {
      await Promise.resolve()
      blockUpdates.current = false
    }

    // Get current block status of linked form elements.
    const isLinkedUpdatesBlocked = () => {
      return blockUpdates.current
    }

    /**
     * handleAmountCryptoChange - Set the amountFiat field whenever the crypto amount changes.
     *
     * @param {string} value Value
     */
    const handleAmountCryptoChange = async value => {
      if (!isLinkedUpdatesBlocked()) {
        blockLinkedUpdates()
        const lastPrice = currentTicker[fiatCurrency]
        const fiatValue = convert(cryptoUnit, 'fiat', value, lastPrice)
        formApi.setValue('amountFiat', fiatValue)
        await unblockLinkedUpdates()
      }
      onChange && onChange()
    }

    /**
     * handleAmountFiatChange - Set the amountCrypto field whenever the fiat amount changes.
     *
     * @param {string} value Value
     */
    const handleAmountFiatChange = async value => {
      if (!isLinkedUpdatesBlocked()) {
        blockLinkedUpdates()
        const lastPrice = currentTicker[fiatCurrency]
        const cryptoValue = convert('fiat', cryptoUnit, value, lastPrice)
        formApi.setValue('amountCrypto', cryptoValue)
        await unblockLinkedUpdates()
      }
      onChange && onChange()
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
                cryptoUnit={cryptoUnit}
                field="amountCrypto"
                forwardedRef={ref || inputRef}
                initialValue={initialAmountCrypto}
                isDisabled={isDisabled}
                isRequired={isRequired}
                label={cryptoLabel || <FormattedMessage {...messages.amount} />}
                name="amountCrypto"
                onValueChange={handleAmountCryptoChange}
                validate={validate}
                validateOnBlur={validateOnBlur}
                validateOnChange={validateOnChange}
                width={150}
                willAutoFocus={willAutoFocus}
              />
            </Box>
            <Dropdown
              activeKey={cryptoUnit}
              items={cryptoUnits}
              ml={2}
              mt={40}
              onChange={handleCryptoCurrencyChange}
              valueField="name"
            />
          </Flex>
          <Flex justifyContent="center" mt={42} width={1 / 11}>
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
                label={fiatLabel || <Span>&nbsp;</Span>}
                name="amountFiat"
                onValueChange={handleAmountFiatChange}
                width={150}
              />
            </Box>

            <Dropdown
              activeKey={fiatCurrency}
              items={fiatCurrencies}
              ml={2}
              mt={40}
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
  cryptoLabel: PropTypes.node,
  cryptoUnit: PropTypes.string.isRequired,
  cryptoUnits: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentTicker: PropTypes.object.isRequired,
  fiatCurrencies: PropTypes.array.isRequired,
  fiatCurrency: PropTypes.string.isRequired,
  fiatLabel: PropTypes.node,
  formApi: PropTypes.object.isRequired,
  forwardedRef: PropTypes.object,
  initialAmountCrypto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialAmountFiat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func,
  setCryptoCurrency: PropTypes.func.isRequired,
  setFiatCurrency: PropTypes.func.isRequired,
  validate: PropTypes.func,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  willAutoFocus: PropTypes.bool,
}

CurrencyFieldGroup.defaultProps = {
  isDisabled: false,
  initialAmountCrypto: null,
  initialAmountFiat: null,
  validateOnBlur: true,
  validateOnChange: true,
}
export default CurrencyFieldGroup
