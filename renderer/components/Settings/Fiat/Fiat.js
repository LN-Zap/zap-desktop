import React from 'react'
import PropTypes from 'prop-types'
import { MenuContainer, Menu, MenuItem } from 'components/UI/Dropdown'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const Fiat = ({ fiatTicker, fiatTickers, disableSubMenu, setFiatTicker }) => (
  <MenuContainer>
    <Menu justify="right">
      <MenuItem
        bg="primaryColor"
        hasParent
        item={{ key: 'fiat', name: <FormattedMessage {...messages.title} /> }}
        onClick={disableSubMenu}
      />
      {fiatTickers.map(ft => (
        <MenuItem
          key={ft}
          active={fiatTicker === ft}
          item={{ key: ft, name: ft }}
          onClick={() => setFiatTicker(ft)}
        />
      ))}
    </Menu>
  </MenuContainer>
)

Fiat.propTypes = {
  disableSubMenu: PropTypes.func.isRequired,
  fiatTicker: PropTypes.string.isRequired,
  fiatTickers: PropTypes.array.isRequired,
  setFiatTicker: PropTypes.func.isRequired,
}

export default Fiat
