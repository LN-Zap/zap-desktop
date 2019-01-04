import React from 'react'
import PropTypes from 'prop-types'
import { getLanguageName } from 'lib/i18n'
import { MenuContainer, Menu, MenuItem } from 'components/UI/Dropdown'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const Translate = ({ locales, disableSubMenu, currentLocale, setLocale }) => {
  const changeLocale = lng => {
    setLocale(lng)
  }

  return (
    <MenuContainer>
      <Menu>
        <MenuItem
          item={{ key: 'fiat', name: <FormattedMessage {...messages.title} /> }}
          onClick={disableSubMenu}
          bg="primaryColor"
          hasParent
        />
        {Object.keys(locales).map(lang => (
          <MenuItem
            key={lang}
            item={{ key: lang, name: getLanguageName(lang) }}
            onClick={() => changeLocale(lang)}
            active={currentLocale === lang}
          />
        ))}
      </Menu>
    </MenuContainer>
  )
}

Translate.propTypes = {
  locales: PropTypes.object.isRequired,
  currentLocale: PropTypes.string.isRequired,
  setLocale: PropTypes.func.isRequired,
  disableSubMenu: PropTypes.func.isRequired
}

export default Translate
