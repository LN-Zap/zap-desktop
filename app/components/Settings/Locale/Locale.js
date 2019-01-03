import React from 'react'
import PropTypes from 'prop-types'
import { getLanguageName } from 'lib/i18n'
import { Span } from 'components/UI'
import AngleLeft from 'components/Icon/AngleLeft'
import Check from 'components/Icon/Check'
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
        <AngleLeft color="gray" width="1.5em" height="1.5em" />
        <Span ml={2}>
          <FormattedMessage {...messages.title} />
        </Span>
      </header>
      <ul className={styles.locales}>
        {Object.keys(locales).map(lang => {
          return (
            <li
              key={lang}
              className={currentLocale === lang ? styles.active : ''}
              onClick={() => changeLocale(lang)}
            >
              <span>{getLanguageName(lang)}</span>
              {currentLocale === lang && <Check />}
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
