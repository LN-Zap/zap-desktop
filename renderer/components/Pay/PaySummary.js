import React from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring/renderprops.cjs'
import PaySummaryLightning from 'containers/Pay/PaySummaryLightning'
import PaySummaryOnChain from 'containers/Pay/PaySummaryOnChain'
import { getMaxFee, getMinFee } from '@zap/utils/crypto'
import { PAY_FORM_STEPS } from './constants'
import { getFeeRate } from './utils'

const PaySummary = props => {
  const renderPaySummaryComponent = () => {
    const { amountInSats, formApi, isLn, isOnchain, lndTargetConfirmations, routes } = props
    const formState = formApi.getState()
    const { speed, payReq, isCoinSweep } = formState.values
    let minFee, maxFee
    if (routes.length) {
      minFee = getMinFee(routes)
      maxFee = getMaxFee(routes)
    }

    if (isOnchain) {
      return (
        <PaySummaryOnChain
          address={payReq}
          amount={amountInSats}
          fee={getFee()}
          isCoinSweep={isCoinSweep}
          lndTargetConfirmations={lndTargetConfirmations}
          mt={-3}
          speed={speed}
        />
      )
    } else if (isLn) {
      return (
        <PaySummaryLightning
          amount={amountInSats}
          maxFee={maxFee}
          minFee={minFee}
          mt={-3}
          payReq={payReq}
        />
      )
    }
  }

  /**
   * getFee - Get the current per byte fee based on the form values.
   *
   * @returns {number} Fee rate for currently selected conf speed
   */
  const getFee = () => {
    const { formApi, onchainFees } = props
    const formState = formApi.getState()
    const { speed } = formState.values

    return getFeeRate(onchainFees, speed)
  }

  const { currentStep } = props

  return (
    <Transition
      enter={{ opacity: 1, height: 'auto' }}
      from={{ opacity: 0, height: 0 }}
      initial={{ opacity: 1, height: 'auto' }}
      items={currentStep === PAY_FORM_STEPS.summary}
      leave={{ opacity: 0, height: 0 }}
      native
    >
      {show =>
        show &&
        /* eslint-disable  react/display-name */
        (styles => <animated.div style={styles}>{renderPaySummaryComponent()}</animated.div>)
      }
    </Transition>
  )
}

PaySummary.displayName = 'PaySummary'

PaySummary.propTypes = {
  amountInSats: PropTypes.number.isRequired,
  currentStep: PropTypes.string.isRequired,
  formApi: PropTypes.object.isRequired,
  isLn: PropTypes.bool,
  isOnchain: PropTypes.bool,
  lndTargetConfirmations: PropTypes.shape({
    fast: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    slow: PropTypes.number.isRequired,
  }).isRequired,
  onchainFees: PropTypes.shape({
    fast: PropTypes.number,
    medium: PropTypes.number,
    slow: PropTypes.number,
  }),
  routes: PropTypes.array,
}

PaySummary.defaultProps = {
  onchainFees: {},
  routes: [],
}

export default PaySummary
