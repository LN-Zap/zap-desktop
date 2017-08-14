// @flow
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import ReactSVG from 'react-svg'
import { MdAccountBalanceWallet, MdSettings } from 'react-icons/lib/md'
import { FaClockO, FaBitcoin, FaDollar } from 'react-icons/lib/fa'
import { btc } from '../../../../utils'
import styles from './Nav.scss'

class Nav extends Component {
  render() {
    const { 
      ticker,
      balance,
      setCurrency,
      formClicked
    } = this.props

    return (
      <nav className={styles.nav}>
        <ul className={styles.info}>
          <li className={`${styles.currencies} ${styles.link}`}>
            <span 
              data-hint={ticker.btcTicker ? ticker.btcTicker.price_usd : null}
              className={`${styles.currency} ${ticker.currency === 'btc' ? styles.active : ''} hint--bottom`}
              onClick={() => setCurrency('btc')}
            >
              <FaBitcoin />
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
              <span>{ticker.currency === 'btc' ? <FaBitcoin /> : <FaDollar />}</span>
              <span>
                {
                  ticker.currency === 'btc' ?
                    btc.satoshisToBtc(balance.walletBalance)
                  :
                    btc.satoshisToUsd(balance.walletBalance, ticker.btcTicker.price_usd)
                }
              </span>
            </p>
            <p data-hint='Channel balance' className='hint--bottom-left'>
              <span>
                {ticker.currency === 'btc' ? <FaBitcoin /> : <FaDollar />}
              </span>
              <span>
                {
                  ticker.currency === 'btc' ?
                    btc.satoshisToBtc(balance.channelBalance)
                  :
                    btc.satoshisToUsd(balance.channelBalance, ticker.btcTicker.price_usd)
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
          <li>
            <NavLink to='/settings' activeClassName={styles.active} className={styles.link}>
              <MdSettings />
              <span>Settings</span>
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
  }
}

Nav.propTypes = {
  ticker: React.PropTypes.object.isRequired,
  balance: React.PropTypes.object.isRequired,
  formClicked: React.PropTypes.func.isRequired
}

export default Nav