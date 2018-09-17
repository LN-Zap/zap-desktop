import React from 'react'
import PropTypes from 'prop-types'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'
import ISO6391 from 'iso-639-1'
import Isvg from 'react-inlinesvg'
import checkIcon from 'icons/check.svg'

import { FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './Locale.scss'

const Translate = ({ locales, disableSubMenu, currentLocale, setLocale }) => {
  const changeLocale = lng => {
    setLocale(lng)
  }

  return (
    <div>
      <header className={styles.submenuHeader} onClick={disableSubMenu}>
        <FaAngleLeft />
        <FormattedMessage {...messages.title} />
      </header>
      <ul className={styles.locales}>
        {Object.keys(locales).map(lang => {
          return (
            <li
              key={lang}
              className={currentLocale === lang ? styles.active : ''}
              onClick={() => changeLocale(lang)}
            >
              <span>{ISO6391.getName(lang.split('-')[0])}</span>
              {currentLocale === lang && <Isvg src={checkIcon} />}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

Translate.propTypes = {
  locales: PropTypes.object.isRequired,
  currentLocale: PropTypes.string.isRequired,
  setLocale: PropTypes.func.isRequired,
  disableSubMenu: PropTypes.func.isRequired
}

export default Translate
