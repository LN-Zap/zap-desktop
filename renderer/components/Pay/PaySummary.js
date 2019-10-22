import React from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring/renderprops.cjs'
import PaySummaryLightning from 'containers/Pay/PaySummaryLightning'
import PaySummaryOnChain from 'containers/Pay/PaySummaryOnChain'
import { getMaxFeeInclusive, getMinFee } from '@zap/utils/crypto'
import { PAY_FORM_STEPS } from './constants'
import { getFeeRate } from './utils'

const PaySummary = props => {
  const { amountInSats, formApi, isOnchain, lndTargetConfirmations } = props
  const formState = formApi.getState()
  const { speed, payReq, isCoinSweep } = formState.values

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
  }

  const { routes } = props
  let minFee = 0
  let maxFeeInclusive = 0
  if (routes.length) {
    minFee = getMinFee(routes)
    maxFeeInclusive = getMaxFeeInclusive(routes)
  }

  return (
    <PaySummaryLightning
      amount={amountInSats}
      maxFee={maxFeeInclusive}
      minFee={minFee}
      mt={-3}
      payReq={payReq}
    />
  )
}

PaySummary.displayName = 'PaySummary'

PaySummary.propTypes = {
  amountInSats: PropTypes.number.isRequired,
  formApi: PropTypes.object.isRequired,
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

const PaySummaryWithTransition = props => {
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
        (styles => (
          <animated.div style={styles}>
            <PaySummary {...props} />
          </animated.div>
        ))
      }
    </Transition>
  )
}

PaySummaryWithTransition.displayName = 'PaySummaryWithTransition'
PaySummaryWithTransition.propTypes = {
  ...PaySummary.propTypes,
  currentStep: PropTypes.string.isRequired,
}

export default PaySummaryWithTransition
