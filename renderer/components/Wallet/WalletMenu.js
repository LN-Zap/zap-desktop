import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import SettingsMenu from 'containers/Settings/SettingsMenu'
import ChannelsMenu from 'containers/Channels/ChannelsMenu'
import { Text } from 'components/UI'
import { isAutopayEnabled } from '@zap/utils/featureFlag'
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

const AutopayMenuItem = ({ openModal }) => (
  <MenuItem onClick={() => openModal('AUTOPAY')}>
    <FormattedMessage {...messages.menu_item_autopay} />
  </MenuItem>
)

AutopayMenuItem.propTypes = {
  openModal: PropTypes.func.isRequired,
}

const WalletMenu = ({ openModal }) => {
  return (
    <Flex as="section">
      <ChannelsMenu />
      {isAutopayEnabled() && <AutopayMenuItem openModal={openModal} />}
      <SettingsMenu
        css={`
          position: relative;
          z-index: 40;
        `}
        ml={4}
      />
    </Flex>
  )
}

WalletMenu.propTypes = {
  openModal: PropTypes.func.isRequired,
}

export default WalletMenu
