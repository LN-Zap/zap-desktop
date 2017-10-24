import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import ReactSVG from 'react-svg'
import { MdAccountBalanceWallet } from 'react-icons/lib/md'
import { FaClockO } from 'react-icons/lib/fa'
import styles from './Nav.scss'

const Nav = ({ openPayForm, openRequestForm }) => (
  <nav className={styles.nav}>
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
      <div className={styles.button} onClick={openPayForm}>
        <span>Pay</span>
      </div>
      <div className={styles.button} onClick={openRequestForm}>
        <span>Request</span>
      </div>
    </div>
  </nav>
)

Nav.propTypes = {
  openPayForm: PropTypes.func.isRequired,
  openRequestForm: PropTypes.func.isRequired
}

export default Nav
