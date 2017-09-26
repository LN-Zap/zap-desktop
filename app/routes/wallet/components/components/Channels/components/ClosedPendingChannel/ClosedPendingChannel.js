import { shell } from 'electron'
import React from 'react'
import PropTypes from 'prop-types'
import { btc } from 'utils'
import styles from './ClosedPendingChannel.scss'

const ClosedPendingChannel = ({ ticker, channel: { channel, closing_txid }, currentTicker, explorerLinkBase }) => (
  <li className={styles.channel} onClick={() => shell.openExternal(`${explorerLinkBase}/tx/${closing_txid}`)}>
    <h1 className={styles.closing}>Status: Closing</h1>
    <div className={styles.left}>
      <section className={styles.remotePubkey}>
        <span>Remote Pubkey</span>
        <h4>{channel.remote_node_pub}</h4>
      </section>
      <section className={styles.channelPoint}>
        <span>Channel Point</span>
        <h4>{channel.channel_point}</h4>
      </section>
    </div>
    <div className={styles.right}>
      <section className={styles.capacity}>
        <span>Capacity</span>
        <h2>
          {
            ticker.currency === 'btc' ?
              btc.satoshisToBtc(channel.capacity)
              :
              btc.satoshisToUsd(channel.capacity, currentTicker.price_usd)
          }
        </h2>
      </section>
      <div className={styles.balances}>
        <section>
          <h4>
            {
              ticker.currency === 'btc' ?
                btc.satoshisToBtc(channel.local_balance)
                :
                btc.satoshisToUsd(channel.local_balance, currentTicker.price_usd)
            }
          </h4>
          <span>Local</span>
        </section>
        <section>
          <h4>
            {
              ticker.currency === 'btc' ?
                btc.satoshisToBtc(channel.remote_balance)
                :
                btc.satoshisToUsd(channel.remote_balance, currentTicker.price_usd)
            }
          </h4>
          <span>Remote</span>
        </section>
      </div>
    </div>
  </li>
)

ClosedPendingChannel.propTypes = {
  ticker: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  explorerLinkBase: PropTypes.string.isRequired
}

export default ClosedPendingChannel
