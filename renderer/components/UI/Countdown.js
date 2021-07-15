import React, { useState } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, FormattedRelativeTime } from 'react-intl'

import { useTimeout } from 'hooks'

import messages from './messages'
import Text from './Text'

const Countdown = ({
  offset,
  onExpire,
  colorActive,
  colorExpired,
  countdownStyle,
  isContinual,
  updateInterval,
  ...rest
}) => {
  let expiresIn = offset
  if (offset instanceof Date) {
    expiresIn = offset - Date.now()
    expiresIn = Math.round(expiresIn / 1000)
  }

  const [isExpired, setIsExpired] = useState(expiresIn <= 0)

  useTimeout(() => {
    setIsExpired(true)
    onExpire && onExpire()
  }, expiresIn * 1000)

  return (
    <Text color={isExpired ? colorExpired : colorActive} {...rest}>
      {isExpired ? (
        <FormattedMessage {...messages.expired} />
      ) : (
        <FormattedMessage {...messages.expires} />
      )}
      {(!isExpired || (isExpired && isContinual)) && (
        <>
          <i> </i>
          <FormattedRelativeTime
            style={countdownStyle}
            updateIntervalInSeconds={updateInterval}
            value={expiresIn}
          />
        </>
      )}
    </Text>
  )
}

Countdown.propTypes = {
  colorActive: PropTypes.string,
  colorExpired: PropTypes.string,
  countdownStyle: PropTypes.string,
  isContinual: PropTypes.bool,
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
  onExpire: PropTypes.func,
  updateInterval: PropTypes.number,
}

Countdown.defaultProps = {
  colorActive: 'superGreen',
  colorExpired: 'superRed',
  countdownStyle: 'long',
  isContinual: true,
  updateInterval: 1,
}

export default Countdown
