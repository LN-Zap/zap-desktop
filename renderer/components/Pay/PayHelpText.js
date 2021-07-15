import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { animated, Transition } from 'react-spring/renderprops.cjs'

import { Text } from 'components/UI'

import { PAY_FORM_STEPS } from './constants'
import messages from './messages'

const PayHelpText = props => {
  const { chainName, cryptoUnitName, currentStep, previousStep, redirectPayReq } = props

  // Do not render the help text if the form has just loadad with an initial payment request.
  if (redirectPayReq && !previousStep) {
    return null
  }

  return (
    <Transition
      enter={{ opacity: 1, height: 80 }}
      from={{ opacity: 0, height: 0 }}
      initial={{ opacity: 1, height: 80 }}
      items={currentStep === PAY_FORM_STEPS.address}
      leave={{ opacity: 0, height: 0 }}
      native
    >
      {show =>
        show &&
        /* eslint-disable  react/display-name */
        (styles => (
          <animated.div style={styles}>
            <Text mb={4}>
              <FormattedMessage
                {...messages.description}
                values={{ chain: chainName, ticker: cryptoUnitName }}
              />
            </Text>
          </animated.div>
        ))
      }
    </Transition>
  )
}

PayHelpText.displayName = 'PayHelpText'

PayHelpText.propTypes = {
  chainName: PropTypes.string.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  currentStep: PropTypes.string.isRequired,
  previousStep: PropTypes.string,
  redirectPayReq: PropTypes.object,
}

export default PayHelpText
