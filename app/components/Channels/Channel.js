import React from 'react'
import PropTypes from 'prop-types'
import { FaCircle } from 'react-icons/lib/fa'
import { btc } from 'utils'
import styles from './Channel.scss'

const Channel = ({ ticker, channel, setChannel, currentTicker }) => (
  <li className={styles.channel} onClick={() => setChannel(channel)}>
    <header>
      <span className={styles.status}>Open</span>
      {
        channel.active ?
          <span className={styles.active}>
            <FaCircle />
            <i>Active</i>
          </span>
          :
          <span className={styles.notactive}>
            <FaCircle />
            <i>Not Active</i>
          </span>
      }
    </header>
    <div className={styles.left}>
      <section className={styles.remotePubkey}>
        <span>Remote Pubkey</span>
        <h4>{channel.remote_pubkey}</h4>
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
          <span>Local</span>
          <h4>
            {
              ticker.currency === 'btc' ?
                btc.satoshisToBtc(channel.local_balance)
                :
                btc.satoshisToUsd(channel.local_balance, currentTicker.price_usd)
            }
          </h4>
        </section>
        <section>
          <span>Remote</span>
          <h4>
            {
              ticker.currency === 'btc' ?
                btc.satoshisToBtc(channel.remote_balance)
                :
                btc.satoshisToUsd(channel.remote_balance, currentTicker.price_usd)
            }
          </h4>
        </section>
      </div>
    </div>
  </li>
)

Channel.propTypes = {
  ticker: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  setChannel: PropTypes.func.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Channel
