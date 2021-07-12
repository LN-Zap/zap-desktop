import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import { isAutopayEnabled } from '@zap/utils/featureFlag'
import { Text } from 'components/UI'
import ChannelsMenu from 'containers/Channels/ChannelsMenu'
import SettingsMenu from 'containers/Settings/SettingsMenu'

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
        ml={4}
        sx={{
          zIndex: 40,
          position: 'relative',
        }}
      />
    </Flex>
  )
}

WalletMenu.propTypes = {
  openModal: PropTypes.func.isRequired,
}

export default WalletMenu
