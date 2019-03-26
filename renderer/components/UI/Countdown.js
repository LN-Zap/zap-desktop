import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedRelative } from 'react-intl'
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
    date: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
    isContinual: PropTypes.bool,
    updateInterval: PropTypes.number,
  }

  static defaultProps = {
    colorActive: 'superGreen',
    colorExpired: 'superRed',
    countdownStyle: 'best fit',
    isContinual: true,
    updateInterval: 1000,
  }

  componentDidMount() {
    let { date } = this.props
    if (date instanceof Date) {
      date = new Date(date)
    }

    const expiresIn = date - Date.now()
    if (expiresIn >= 0) {
      this.setState({ isExpired: false })
      const timer = setInterval(() => this.setState({ isExpired: true }), expiresIn)
      this.setState({ timer })
    } else {
      this.setState({ isExpired: true })
    }
  }

  componentWillUnmount() {
    const { timer } = this.state
    clearInterval(timer)
  }

  render() {
    const {
      colorActive,
      colorExpired,
      countdownStyle,
      isContinual,
      date,
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
            <FormattedRelative
              style={countdownStyle}
              updateInterval={updateInterval}
              value={new Date(date)}
            />
          </React.Fragment>
        )}
      </Text>
    )
  }
}

export default Countdown
