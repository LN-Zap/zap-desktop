// @flow
import React, { Component } from 'react'
import { btc } from '../../../../../../../utils'
import styles from './ClosedPendingChannel.scss'

class ClosedPendingChannel extends Component {
  render() {
    const { ticker, channel, setChannel } = this.props
    return (
        <li className={styles.channel}>
            ClosedPendingChannel
        </li>
    )
  }
}


export default ClosedPendingChannel