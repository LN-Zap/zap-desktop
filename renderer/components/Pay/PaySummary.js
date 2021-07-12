import React from 'react'

import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring/renderprops.cjs'

import { getMaxFeeInclusive, getMinFee, getExactFee } from '@zap/utils/crypto'
import PaySummaryLightning from 'containers/Pay/PaySummaryLightning'
import PaySummaryOnChain from 'containers/Pay/PaySummaryOnChain'

import { PAY_FORM_STEPS, PAYMENT_TYPES } from './constants'
import { getFeeRate } from './utils'

const PaySummary = props => {
  const { amountInSats, formApi, lndTargetConfirmations, onchainFees, paymentType, routes } = props
  const formState = formApi.getState()
  const { speed, payReq, isCoinSweep } = formState.values

  const isOnchain = paymentType === PAYMENT_TYPES.onchain
  if (isOnchain) {
    return (
      <PaySummaryOnChain
        address={payReq}
        amount={amountInSats}
        fee={getFeeRate(onchainFees, speed)}
        isCoinSweep={isCoinSweep}
        lndTargetConfirmations={lndTargetConfirmations}
        mt={-3}
        speed={speed}
      />
    )
  }

  const isPubkey = paymentType === PAYMENT_TYPES.pubkey

  return (
    <PaySummaryLightning
      amount={amountInSats}
      exactFee={getExactFee(routes)}
      isPubkey={isPubkey}
      maxFee={getMaxFeeInclusive(routes)}
      minFee={getMinFee(routes)}
      mt={-3}
      payReq={payReq}
      route={routes[0]}
    />
  )
}

PaySummary.displayName = 'PaySummary'

PaySummary.propTypes = {
  amountInSats: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formApi: PropTypes.object.isRequired,
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
  paymentType: PropTypes.oneOf(Object.values(PAYMENT_TYPES)).isRequired,
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
