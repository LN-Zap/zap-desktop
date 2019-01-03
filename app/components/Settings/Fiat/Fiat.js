import React from 'react'
import PropTypes from 'prop-types'
import { MenuContainer, Menu, MenuItem } from 'components/UI/Dropdown'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const Fiat = ({ fiatTicker, fiatTickers, disableSubMenu, setFiatTicker }) => (
  <MenuContainer>
    <Menu onClick={disableSubMenu}>
      <MenuItem
        item={{ key: 'fiat', name: <FormattedMessage {...messages.title} /> }}
        onClick={disableSubMenu}
        bg="primaryColor"
        hasParent
      />
      {fiatTickers.map(ft => (
        <MenuItem
          key={ft}
          item={{ key: ft, name: ft }}
          onClick={() => setFiatTicker(ft)}
          active={fiatTicker === ft}
        />
      ))}
    </Menu>
  </MenuContainer>
)

Fiat.propTypes = {
  fiatTicker: PropTypes.string.isRequired,
  fiatTickers: PropTypes.array.isRequired,
  disableSubMenu: PropTypes.func.isRequired,
  setFiatTicker: PropTypes.func
}

export default Fiat
