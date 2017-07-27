// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactSVG from 'react-svg'
import { MdAccountBalanceWallet, MdSettings } from 'react-icons/lib/md'
import { FaClockO, FaBitcoin, FaDollar } from 'react-icons/lib/fa'
import { satoshisToBtc } from '../../../../utils/bitcoin'
import styles from './Nav.scss'

class Nav extends Component {
  render() {
    const { ticker, balance, formClicked } = this.props
    return (
      <nav className={styles.nav}>
        <ul className={styles.info}>
          <li className={`${styles.currencies} ${styles.link}`}>
            <span className={`${styles.currency} ${ticker.current === 'btc' ? styles.active : ''}`}>
              <FaBitcoin />
            </span>
            <span className={`${styles.currency} ${ticker.current === 'usd' ? styles.active : ''}`}>
              <FaDollar />
            </span>
          </li>
          <li className={`${styles.balance} ${styles.link}`}>
            <p data-hint='Wallet balance' className='hint--bottom-left'>
              <span>{ticker.current === 'btc' ? <FaBitcoin /> : <FaDollar />}</span>
              <span>{satoshisToBtc(balance.walletBalance)}</span>
            </p>
            <p data-hint='Channel balance' className='hint--bottom-left'>
              <span>{ticker.current === 'btc' ? <FaBitcoin /> : <FaDollar />}</span>
              <span>{satoshisToBtc(balance.channelBalance)}</span>
            </p>
          </li>
        </ul>

        <div className={styles.logo}>
          <ReactSVG path='../resources/zap_2.svg' />
        </div>

        <ul className={styles.links}>
          <li className={styles.link}>
            <FaClockO />
            <span>Activity</span>
          </li>
          <li className={styles.link}>
            <MdAccountBalanceWallet />
            <span>Wallet</span>
          </li>
          <li className={styles.link}>
            <MdSettings />
            <span>Settings</span>
          </li>
        </ul>  
        <div className={styles.buttons}>
          <div className={styles.button} onClick={formClicked}>
            <span>New</span>
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