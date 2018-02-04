import React from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'
import { FaAngleDown, FaCircle } from 'react-icons/lib/fa'
import { btc } from 'utils'
import plus from 'icons/plus.svg'
import search from 'icons/search.svg'
import styles from './Network.scss'

const Network = ({ channels, balance, currentTicker }) => {
  console.log('channels: ', channels)

  return (
    <div className={styles.network}>
      <header className={styles.header}>
        <section>
          <h2>My Network</h2>
          <span className={styles.channelAmount}>
            {btc.satoshisToBtc(balance.channelBalance)}BTC ≈ ${btc.satoshisToUsd(balance.channelBalance, currentTicker.price_usd).toLocaleString()}
          </span>
        </section>
        <section className={styles.addChannel}>
          <Isvg src={plus} />
        </section>
      </header>

      <div className={styles.channels}>
        <header className={styles.listHeader}>
          <div>
            <span>All <FaAngleDown /></span>
          </div>
          <div>
            <span>Refresh</span>
          </div>
        </header>

        <ul>
          {
            channels.channels.map(channel => {
              console.log('channel: ', channel)
            })
          }
        </ul>
      </div>

      <footer className={styles.search}>
        <label htmlFor='search' className={`${styles.label} ${styles.input}`}>
          <Isvg src={search} />
        </label>
        <input id='search' type='text' className={`${styles.text} ${styles.input}`} placeholder='search by alias or pubkey' />
      </footer>
    </div>
  )
}

Network.propTypes = {}

export default Network
