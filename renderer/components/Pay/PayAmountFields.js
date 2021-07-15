import React from 'react'

import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Keyframes } from 'react-spring/renderprops.cjs'
import { Box, Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { convert } from '@zap/utils/btc'
import { CoinBig } from '@zap/utils/coin'
import { TransactionFeeInput, Toggle, Label } from 'components/Form'
import { Bar } from 'components/UI'
import { CurrencyFieldGroup } from 'containers/Form'

import { PAY_FORM_STEPS } from './constants'
import messages from './messages'
import { getAmountInSats, getFeeRate } from './utils'

/**
 * Animation to handle showing/hiding the amount fields.
 */
const ShowHideAmount = Keyframes.Spring({
  show: async (next, cancel, ownProps) => {
    await next({ display: 'block' })
    ownProps.context.focusAmountInput()
    await next({ opacity: 1, height: 'auto' })
  },
  hide: { opacity: 0, height: 0, display: 'none' },
  remove: { opacity: 0, height: 0, display: 'none', immediate: true },
})

class PayAmountFields extends React.Component {
  amountInput = React.createRef()

  updateFees = debounce(() => {
    const { isOnchain } = this.props
    // We only need to updated fees for on-chain transactions
    if (!isOnchain) {
      return
    }
    const { cryptoUnit, formApi, invoice, queryFees } = this.props
    const formState = formApi.getState()
    const { payReq: address } = formState.values
    const amount = formApi.getValue('amountCrypto') || 0
    const amountInSats = getAmountInSats(amount, cryptoUnit, invoice)
    if (CoinBig(amountInSats).gt(0)) {
      queryFees(address, amountInSats)
    }
  }, 500)

  static propTypes = {
    bip21decoded: PropTypes.object,
    cryptoUnit: PropTypes.string.isRequired,
    currentStep: PropTypes.string.isRequired,
    formApi: PropTypes.object.isRequired,
    initialAmountCrypto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    initialAmountFiat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    intl: intlShape.isRequired,
    invoice: PropTypes.object,
    isOnchain: PropTypes.bool,
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
    queryFees: PropTypes.func.isRequired,
    walletBalanceConfirmed: PropTypes.string.isRequired,
  }

  static defaultProps = {
    onchainFees: {},
  }

  setCoinSweep = isEnabled => {
    if (isEnabled) {
      const { cryptoUnit, formApi, walletBalanceConfirmed } = this.props
      const onChainBalance = convert('sats', cryptoUnit, walletBalanceConfirmed)
      formApi.setValue('amountCrypto', onChainBalance.toString())
    }
  }

  /**
   * getFee - Get the current per byte fee based on the form values.
   *
   * @returns {number} Fee rate for currently selected conf speed
   */
  getFee = () => {
    const { formApi, onchainFees } = this.props
    const formState = formApi.getState()
    const { speed } = formState.values

    return getFeeRate(onchainFees, speed)
  }

  /**
   * focusAmountInput - Focus the amount input.
   */
  focusAmountInput = () => {
    if (this.amountInput.current) {
      this.amountInput.current.focus()
    }
  }

  getAmountFieldsDisplayState = () => {
    const { currentStep } = this.props
    let amountFieldsDisplayState = 'remove'
    if (currentStep === PAY_FORM_STEPS.amount) {
      amountFieldsDisplayState = 'show'
    } else if (currentStep === PAY_FORM_STEPS.address) {
      amountFieldsDisplayState = 'hide'
    }

    return amountFieldsDisplayState
  }

  render() {
    const {
      currentStep,
      formApi,
      intl,
      initialAmountCrypto,
      initialAmountFiat,
      isOnchain,
      isQueryingFees,
      lndTargetConfirmations,
    } = this.props
    const formState = formApi.getState()
    const { isCoinSweep } = formState.values
    const amountFieldsDisplayState = this.getAmountFieldsDisplayState()

    return (
      <ShowHideAmount context={this} state={amountFieldsDisplayState}>
        {styles => (
          <Box style={styles}>
            <Bar my={3} variant="light" />

            <CurrencyFieldGroup
              formApi={formApi}
              forwardedRef={this.amountInput}
              initialAmountCrypto={initialAmountCrypto}
              initialAmountFiat={initialAmountFiat}
              isDisabled={currentStep !== PAY_FORM_STEPS.amount || isCoinSweep}
              isRequired
              onChange={this.updateFees}
            />

            {isOnchain && (
              <>
                <Bar my={3} variant="light" />

                <Flex alignItems="center" justifyContent="space-between">
                  <Label htmlFor="isCoinSweep">
                    <FormattedMessage {...messages.sweep_funds} />
                  </Label>
                  <Toggle field="isCoinSweep" id="isCoinSweep" onValueChange={this.setCoinSweep} />
                </Flex>

                <Bar my={3} variant="light" />

                <TransactionFeeInput
                  fee={this.getFee()}
                  field="speed"
                  isQueryingFees={isQueryingFees}
                  label={intl.formatMessage({ ...messages.fee })}
                  lndTargetConfirmations={lndTargetConfirmations}
                  required
                />
              </>
            )}
          </Box>
        )}
      </ShowHideAmount>
    )
  }
}

export default PayAmountFields
