import React from 'react'
import PropTypes from 'prop-types'

import styles from './Countdown.scss'

class Countdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      days: null,
      hours: null,
      minutes: null,
      seconds: null,
      expired: false,
      interval: null
    }

    this.timerInterval = this.timerInterval.bind(this)
  }

  componentDidMount() {
    const interval = setInterval(this.timerInterval, 1000)
    // store interval in the state so it can be accessed later
    this.setState({ interval })
  }

  componentWillUnmount() {
    const { interval } = this.state
    // use interval from the state to clear the interval
    clearInterval(interval)
  }

  timerInterval() {
    const convertTwoDigits = n => (n > 9 ? n : `0${n}`.slice(-2))

    const now = new Date().getTime()
    const { countDownDate } = this.props
    const countDownSeconds = countDownDate * 1000
    const distance = countDownSeconds - now

    if (distance <= 0) {
      this.setState({ expired: true })
      const { interval } = this.state
      clearInterval(interval)
      return
    }

    const days = convertTwoDigits(Math.floor(distance / (1000 * 60 * 60 * 24)))
    const hours = convertTwoDigits(
      Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    )
    const minutes = convertTwoDigits(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
    const seconds = convertTwoDigits(Math.floor((distance % (1000 * 60)) / 1000))

    this.setState({
      days,
      hours,
      minutes,
      seconds
    })
  }

  render() {
    const { days, hours, minutes, seconds, expired } = this.state

    if (expired) {
      return <span className={`${styles.container} ${styles.expired}`}>Expired</span>
    }
    if (!days && !hours && !minutes && !seconds) {
      return <span className={styles.container} />
    }

    return (
      <span className={styles.container}>
        <i className={styles.caption}>Expires in</i>
        <i>{days > 0 && `${days}:`}</i>
        <i>{hours > 0 && `${hours}:`}</i>
        <i>{minutes > 0 && `${minutes}:`}</i>
        <i>{seconds >= 0 && `${seconds}`}</i>
      </span>
    )
  }
}

Countdown.propTypes = {
  countDownDate: PropTypes.number.isRequired
}

export default Countdown
