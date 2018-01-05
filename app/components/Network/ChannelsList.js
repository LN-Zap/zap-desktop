import React from 'react'
import PropTypes from 'prop-types'
import { btc, blockExplorer } from 'utils'
import styles from './ChannelsList.scss'

const ChannelsList = ({ channels, updateSelectedChannels, selectedChannelIds }) => (
  <ul className={styles.channels}>
    {
      channels.map(channel => (
        <li key={channel.chan_id} className={styles.channel} onClick={() => updateSelectedChannels(channel)}>
          <span className={`${styles.dot} ${selectedChannelIds.includes(channel.chan_id) && styles.active}`} />

          <header>
            <h1>Capacity: {btc.satoshisToBtc(channel.capacity)}</h1>
            <span onClick={() => blockExplorer.showChannelPoint({ channel })}>Channel Point</span>
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
      ))
    }
  </ul>
)

ChannelsList.propTypes = {
  channels: PropTypes.array.isRequired,
  updateSelectedChannels: PropTypes.func.isRequired,
  selectedChannelIds: PropTypes.array.isRequired
}

export default ChannelsList
