import path from 'path'
import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Isvg from 'react-inlinesvg'
import styles from './Nav.scss'

const Nav = ({ openPayForm, openRequestForm }) => (
  <nav className={styles.nav}>
    <header className={styles.header}>
      <h1>zap</h1>
      <span>beta</span>
    </header>
    <ul className={styles.links}>
      <NavLink exact to='/' activeClassName={styles.active} className={styles.link}>
        <span className={styles.activeBorder} />
        <li>
          <Isvg styles={{ verticalAlign: 'middle' }} src={path.join(__dirname, '..', 'resources/icons/wallet.svg')} />
          <span>Wallet</span>
        </li>
      </NavLink>
      <NavLink exact to='/wallet' activeClassName={styles.active} className={styles.link}>
        <span className={styles.activeBorder} />
        <li>
          <Isvg styles={{ verticalAlign: 'middle' }} src={path.join(__dirname, '..', 'resources/icons/peers.svg')} />
          <span>Peers</span>
        </li>
      </NavLink>
      <NavLink exact to='/channels' activeClassName={styles.active} className={styles.link}>
        <span className={styles.activeBorder} />
        <li>
          <Isvg styles={{ verticalAlign: 'middle' }} src={path.join(__dirname, '..', 'resources/icons/channels.svg')} />
          <span>Channels</span>
        </li>
      </NavLink>
      <NavLink exact to='/settings' activeClassName={styles.active} className={styles.link}>
        <span className={styles.activeBorder} />
        <li>
          <Isvg styles={{ verticalAlign: 'middle' }} src={path.join(__dirname, '..', 'resources/icons/settings.svg')} />
          <span>Settings</span>
        </li>
      </NavLink>
    </ul>
    <div className={styles.buttons}>
      <div className={`buttonPrimary ${styles.button}`} onClick={openPayForm}>
        <span>Pay</span>
      </div>
      <div className={`buttonPrimary ${styles.button}`} onClick={openRequestForm}>
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
