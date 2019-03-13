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
        hasChildren
        item={{ key: 'fiat', name: <FormattedMessage {...messages.fiat} /> }}
        onClick={() => setActiveSubMenu('fiat')}
      />

      <MenuItem
        hasChildren
        item={{ key: 'locale', name: <FormattedMessage {...messages.locale} /> }}
        onClick={() => setActiveSubMenu('locale')}
      />

      <MenuItem
        hasChildren
        item={{ key: 'theme', name: <FormattedMessage {...messages.theme} /> }}
        onClick={() => setActiveSubMenu('theme')}
      />

      <MenuItem
        item={{ key: 'channels', name: <FormattedMessage {...messages.channels} /> }}
        onClick={() => openModal('CHANNELS')}
      />

      <MenuItem
        item={{ key: 'Autopay', name: <FormattedMessage {...messages.autopay} /> }}
        onClick={() => openModal('AUTOPAY')}
      />

      <MenuItem
        item={{ key: 'logout', name: <FormattedMessage {...messages.logout} /> }}
        onClick={() => history.push('/logout')}
      />
    </Menu>
  </MenuContainer>
)

SettingsMenu.propTypes = {
  history: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  setActiveSubMenu: PropTypes.func.isRequired,
}

export default withRouter(SettingsMenu)
