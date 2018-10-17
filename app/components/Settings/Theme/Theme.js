import React from 'react'
import PropTypes from 'prop-types'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'
import Check from 'components/Icon/Check'

import { FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './Theme.scss'

const Theme = ({ currentTheme, disableSubMenu, setTheme, themes }) => (
  <div>
    <header className={styles.submenuHeader} onClick={disableSubMenu}>
      <FaAngleLeft />
      <span>
        <FormattedMessage {...messages.title} />
      </span>
    </header>
    <ul className={styles.themes}>
      {Object.keys(themes).map(theme => {
        return (
          <li
            key={theme}
            className={currentTheme === theme ? styles.active : ''}
            onClick={() => setTheme(theme)}
          >
            <FormattedMessage {...messages[theme]} />
            {currentTheme === theme && <Check />}
          </li>
        )
      })}
    </ul>
  </div>
)

Theme.propTypes = {
  currentTheme: PropTypes.string.isRequired,
  disableSubMenu: PropTypes.func.isRequired,
  setTheme: PropTypes.func,
  themes: PropTypes.object.isRequired
}

export default Theme
