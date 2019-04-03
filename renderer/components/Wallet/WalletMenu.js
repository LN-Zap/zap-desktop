import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import styled from 'styled-components'
import Settings from 'containers/Settings'
import { Text } from 'components/UI'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const StyledText = styled(Text)`
  cursor: pointer;
  transition: all 0.25s;
  &:hover {
    opacity: 0.6;
  }
`
const MenuItem = ({ children, ...rest }) => (
  <StyledText ml={4} pl={2} {...rest}>
    {children}
  </StyledText>
)

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
}

const WalletMenu = ({ openModal }) => (
  <Flex as="section">
    <MenuItem onClick={() => openModal('CHANNELS')}>
      <FormattedMessage {...messages.menu_item_channels} />
    </MenuItem>
    <MenuItem onClick={() => openModal('AUTOPAY')}>
      <FormattedMessage {...messages.menu_item_autopay} />
    </MenuItem>
    <Settings ml={4} />
  </Flex>
)

WalletMenu.propTypes = {
  openModal: PropTypes.func.isRequired,
}

export default WalletMenu
