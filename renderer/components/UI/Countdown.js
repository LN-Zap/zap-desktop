import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedRelativeTime } from 'react-intl'
import Text from './Text'
import messages from './messages'

class Countdown extends React.Component {
  state = {
    isExpired: null,
    timer: null,
  }

  static propTypes = {
    colorActive: PropTypes.string,
    colorExpired: PropTypes.string,
    countdownStyle: PropTypes.string,
    isContinual: PropTypes.bool,
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
    onExpire: PropTypes.func,
    updateInterval: PropTypes.number,
  }

  static defaultProps = {
    colorActive: 'superGreen',
    colorExpired: 'superRed',
    countdownStyle: 'long',
    isContinual: true,
    updateInterval: 1,
  }

  componentWillUnmount() {
    const { timer } = this.state
    clearInterval(timer)
  }

  UNSAFE_componentWillMount() {
    let { offset, onExpire } = this.props
    let expiresIn = offset

    if (offset instanceof Date) {
      expiresIn = offset - Date.now()
      this.expiresIn = Math.round(expiresIn / 1000)
    } else {
      this.expiresIn = expiresIn
    }

    if (expiresIn >= 0) {
      this.setState({ isExpired: false })
      const timer = setInterval(() => {
        this.setState({ isExpired: true })
        onExpire && onExpire()
      }, this.expiresIn * 1000)
      this.setState({ timer })
    } else {
      this.setState({ isExpired: true })
      onExpire && onExpire()
    }
  }

  render() {
    const {
      colorActive,
      colorExpired,
      countdownStyle,
      isContinual,
      offset,
      onExpire,
      updateInterval,
      ...rest
    } = this.props
    const { isExpired } = this.state
    return (
      <Text color={isExpired ? colorExpired : colorActive} {...rest}>
        {isExpired ? (
          <FormattedMessage {...messages.expired} />
        ) : (
          <FormattedMessage {...messages.expires} />
        )}
        {(!isExpired || (isExpired && isContinual)) && (
          <React.Fragment>
            {` `}
            <FormattedRelativeTime
              style={countdownStyle}
              updateIntervalInSeconds={updateInterval}
              value={this.expiresIn}
            />
          </React.Fragment>
        )}
      </Text>
    )
  }
}

export default Countdown
