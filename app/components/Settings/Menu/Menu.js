import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { MenuContainer, Menu, MenuItem } from 'components/UI/Dropdown'
import messages from './messages'

const SettingsMenu = ({ history, setActiveSubMenu, openModal }) => (
  <MenuContainer>
    <Menu justify="right">
      <MenuItem
        item={{ key: 'fiat', name: <FormattedMessage {...messages.fiat} /> }}
        onClick={() => setActiveSubMenu('fiat')}
        hasChildren
      />

      <MenuItem
        item={{ key: 'locale', name: <FormattedMessage {...messages.locale} /> }}
        onClick={() => setActiveSubMenu('locale')}
        hasChildren
      />

      <MenuItem
        item={{ key: 'theme', name: <FormattedMessage {...messages.theme} /> }}
        onClick={() => setActiveSubMenu('theme')}
        hasChildren
      />

      <MenuItem
        item={{ key: 'channels', name: <FormattedMessage {...messages.channels} /> }}
        onClick={() => openModal('CHANNELS')}
      />

      <MenuItem
        item={{ key: 'logout', name: <FormattedMessage {...messages.logout} /> }}
        onClick={() => history.push('/logout')}
      />
    </Menu>
  </MenuContainer>
)

SettingsMenu.propTypes = {
  setActiveSubMenu: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(SettingsMenu)
