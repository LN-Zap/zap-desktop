import React from 'react'
import PropTypes from 'prop-types'
import { MenuContainer, Menu, MenuItem } from 'components/UI/Dropdown'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const Theme = ({ currentTheme, disableSubMenu, setTheme, themes }) => (
  <MenuContainer>
    <Menu justify="right">
      <MenuItem
        bg="primaryColor"
        hasParent
        item={{ key: 'fiat', name: <FormattedMessage {...messages.title} /> }}
        onClick={disableSubMenu}
      />
      {Object.keys(themes).map(theme => (
        <MenuItem
          key={theme}
          active={currentTheme === theme}
          item={{ key: theme, name: <FormattedMessage {...messages[theme]} /> }}
          onClick={() => setTheme(theme)}
        />
      ))}
    </Menu>
  </MenuContainer>
)

Theme.propTypes = {
  currentTheme: PropTypes.string.isRequired,
  disableSubMenu: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
  themes: PropTypes.object.isRequired,
}

export default Theme
