// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactSVG from 'react-svg'
import { MdAccountBalanceWallet, MdSettings } from 'react-icons/lib/md'
import { FaClockO, FaBitcoin, FaDollar } from 'react-icons/lib/fa'
import styles from './Home.scss'

class Home extends Component {
  render() {
    return (
      <div className={styles.container} data-tid='container'>
        <nav className={styles.nav}>
          <ul className={styles.info}>
            <li className={`${styles.currencies} ${styles.link}`}>
              <span className={`${styles.currency} ${styles.btc}`}>
                <FaBitcoin />
              </span>
              <span className={`${styles.currency} ${styles.usd}`}>
                <FaDollar />
              </span>
            </li>
            <li className={`${styles.logo} ${styles.link}`}>
              <ReactSVG path='../resources/zap_2.svg' />
            </li>
            <li className={`${styles.wallet} ${styles.link}`}>
              <span>
                $56.13
              </span>
            </li>
          </ul>

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
            <div className={styles.button}>
              <span>Pay</span>
            </div>
            <div className={styles.button}>
              <span>Request</span>
            </div>
          </div>
        </nav>

        <div className={styles.content}>

        </div>
      </div>
    )
  }
}


export default Home