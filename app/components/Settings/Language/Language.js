import React from 'react'
import PropTypes from 'prop-types'

import { MdKeyboardArrowLeft } from 'react-icons/md'
import ISO6391 from 'iso-639-1'
import Isvg from 'react-inlinesvg'
import checkIcon from 'icons/check.svg'
import styles from './Language.scss'

const Translate = ({ appLocales, disableSubMenu, currentLocale, setLocale }) => {
  const changeLanguage = lng => {
    setLocale(lng)
  }

  return (
    <div>
      <header className={styles.submenuHeader} onClick={disableSubMenu}>
        <MdKeyboardArrowLeft />
        <span>Language</span>
      </header>
      <ul className={styles.languages}>
        {Object.keys(appLocales).map(lang => {
          return (
            <li
              key={lang}
              className={currentLocale === lang ? styles.active : ''}
              onClick={() => changeLanguage(lang)}
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
  appLocales: PropTypes.object.isRequired,
  currentLocale: PropTypes.string.isRequired,
  setLocale: PropTypes.func.isRequired,
  disableSubMenu: PropTypes.func.isRequired
}

export default Translate
