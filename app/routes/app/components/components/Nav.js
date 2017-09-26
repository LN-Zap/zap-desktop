import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import ReactSVG from 'react-svg'
import { MdAccountBalanceWallet } from 'react-icons/lib/md'
import { FaClockO, FaDollar } from 'react-icons/lib/fa'
import CryptoIcon from 'components/CryptoIcon'
import CurrencyIcon from 'components/CurrencyIcon'
import { btc, usd } from 'utils'
import styles from './Nav.scss'

const Nav = ({ ticker, balance, setCurrency, formClicked, currentTicker }) => (
  <nav className={styles.nav}>
    <ul className={styles.info}>
      <li className={`${styles.currencies} ${styles.link}`}>
        <span
          data-hint={currentTicker ? usd.formatUsd(currentTicker.price_usd) : null}
          className={`${styles.currency} ${ticker.currency === ticker.crypto ? styles.active : ''} hint--bottom`}
          onClick={() => setCurrency(ticker.crypto)}
        >
          <CryptoIcon currency={ticker.crypto} />
        </span>
        <span
          className={`${styles.currency} ${ticker.currency === 'usd' ? styles.active : ''}`}
          onClick={() => setCurrency('usd')}
        >
          <FaDollar />
        </span>
      </li>
      <li className={`${styles.balance} ${styles.link}`}>
        <p data-hint='Wallet balance' className='hint--bottom-left'>
          <span><CurrencyIcon currency={ticker.currency} crypto={ticker.crypto} /></span>
          <span>
            {
              ticker.currency === 'usd' ?
                btc.satoshisToUsd(balance.walletBalance, currentTicker.price_usd)
                :
                btc.satoshisToBtc(balance.walletBalance)
            }
          </span>
        </p>
        <p data-hint='Channel balance' className='hint--bottom-left'>
          <span><CurrencyIcon currency={ticker.currency} crypto={ticker.crypto} /></span>
          <span>
            {
              ticker.currency === 'usd' ?
                btc.satoshisToUsd(balance.channelBalance, currentTicker.price_usd)
                :
                btc.satoshisToBtc(balance.channelBalance)
            }
          </span>
        </p>
      </li>
    </ul>

    <div className={styles.logo}>
      <ReactSVG path='../resources/zap_2.svg' />
    </div>

    <ul className={styles.links}>
      <li>
        <NavLink exact to='/' activeClassName={styles.active} className={styles.link}>
          <FaClockO />
          <span>Activity</span>
        </NavLink>
      </li>
      <li>
        <NavLink exact to='/wallet' activeClassName={styles.active} className={styles.link}>
          <MdAccountBalanceWallet />
          <span>Wallet</span>
        </NavLink>
      </li>
    </ul>
    <div className={styles.buttons}>
      <div className={styles.button} onClick={() => formClicked('pay')}>
        <span>Pay</span>
      </div>
      <div className={styles.button} onClick={() => formClicked('request')}>
        <span>Request</span>
      </div>
    </div>
  </nav>
)

Nav.propTypes = {
  ticker: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  setCurrency: PropTypes.func.isRequired,
  formClicked: PropTypes.func.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Nav
