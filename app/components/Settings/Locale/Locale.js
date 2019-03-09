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
      <Menu justify="right">
        <MenuItem
          bg="primaryColor"
          hasParent
          item={{ key: 'fiat', name: <FormattedMessage {...messages.title} /> }}
          onClick={disableSubMenu}
        />
        {Object.keys(locales).map(lang => (
          <MenuItem
            key={lang}
            active={currentLocale === lang}
            item={{ key: lang, name: getLanguageName(lang) }}
            onClick={() => changeLocale(lang)}
          />
        ))}
      </Menu>
    </MenuContainer>
  )
}

Translate.propTypes = {
  currentLocale: PropTypes.string.isRequired,
  disableSubMenu: PropTypes.func.isRequired,
  locales: PropTypes.object.isRequired,
  setLocale: PropTypes.func.isRequired,
}

export default Translate
