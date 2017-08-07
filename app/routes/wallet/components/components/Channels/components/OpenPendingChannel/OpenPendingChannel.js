// @flow
import React, { Component } from 'react'
import { btc } from '../../../../../../../utils'
import styles from './OpenPendingChannel.scss'

class OpenPendingChannel extends Component {
  render() {
    const { ticker, channel, setChannel } = this.props
    return (
        <li className={styles.channel}>
            OpenPendingChannel
        </li>
    )
  }
}


export default OpenPendingChannel