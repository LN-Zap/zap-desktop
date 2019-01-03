import React from 'react'
import PropTypes from 'prop-types'
import { Span } from 'components/UI'
import AngleLeft from 'components/Icon/AngleLeft'
import Check from 'components/Icon/Check'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './Theme.scss'

const Theme = ({ currentTheme, disableSubMenu, setTheme, themes }) => (
  <div>
    <header className={styles.submenuHeader} onClick={disableSubMenu}>
      <AngleLeft color="gray" width="1.5em" height="1.5em" />
      <Span ml={2}>
        <FormattedMessage {...messages.title} />
      </Span>
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
