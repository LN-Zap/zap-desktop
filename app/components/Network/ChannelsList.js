import { shell } from 'electron'
import React from 'react'
import PropTypes from 'prop-types'
import { btc } from 'utils'
import styles from './ChannelsList.scss'

const ChannelsList = ({ channels }) => (
  <ul className={styles.channels}>
    {
      channels.map((channel, index) =>
        <li key={index} className={styles.channel} onClick={() => console.log('channel clicked')}>
          <span className={`${styles.dot}`} />

          <header>
            <h1>Capacity: {btc.satoshisToBtc(channel.capacity)}</h1>
            <span onClick={() => shell.openExternal(`https://testnet.smartbit.com.au/tx/${channel.channel_point.split(':')[0]}`)}>Channel Point</span>
          </header>

          <section>
            <h4>Remote Pubkey:</h4>
            <p>{channel.remote_pubkey.substring(0, Math.min(30, channel.remote_pubkey.length))}...</p>
          </section>

          <section className={styles.funds}>
            <div>
              <h4>Sent:</h4>
              <p>{btc.satoshisToBtc(channel.total_satoshis_sent)} BTC</p>
            </div>
            <div>
              <h4>Received:</h4>
              <p>{btc.satoshisToBtc(channel.total_satoshis_received)} BTC</p>
            </div>
          </section>
        </li>
      )
    }
  </ul>
)

ChannelsList.propTypes = {
  channels: PropTypes.array.isRequired
}

export default ChannelsList
