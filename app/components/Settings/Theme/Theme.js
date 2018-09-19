import React from 'react'
import PropTypes from 'prop-types'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'
import Isvg from 'react-inlinesvg'
import checkIcon from 'icons/check.svg'

import { FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './Theme.scss'

const Fiat = ({ theme, disableSubMenu, setTheme }) => (
  <div>
    <header className={styles.submenuHeader} onClick={disableSubMenu}>
      <FaAngleLeft />
      <span>
        <FormattedMessage {...messages.title} />
      </span>
    </header>
    <ul className={styles.themes}>
      <li className={theme === 'dark' ? styles.active : ''} onClick={() => setTheme('dark')}>
        <span>
          <FormattedMessage {...messages.dark} />
        </span>
        {theme === 'dark' && <Isvg src={checkIcon} />}
      </li>
      <li className={theme === 'light' ? styles.active : ''} onClick={() => setTheme('light')}>
        <span>
          <FormattedMessage {...messages.light} />
        </span>
        {theme === 'light' && <Isvg src={checkIcon} />}
      </li>
    </ul>
  </div>
)

Fiat.propTypes = {
  theme: PropTypes.string.isRequired,
  disableSubMenu: PropTypes.func.isRequired,
  setTheme: PropTypes.func
}

export default Fiat
