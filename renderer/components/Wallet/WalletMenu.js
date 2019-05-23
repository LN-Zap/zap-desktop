import React, { useState, useRef } from 'react'
import { useOnClickOutside, useOnKeydown } from 'hooks'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import SettingsMenu from 'containers/Settings/SettingsMenu'
import ChannelsMenu from 'containers/Channels/ChannelsMenu'
import AngleUp from 'components/Icon/AngleUp'
import AngleDown from 'components/Icon/AngleDown'
import { Text } from 'components/UI'
import { FormattedMessage } from 'react-intl'
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

const ChannelsMenuItem = () => {
  // Create a ref that we add to the element for which we want to detect outside clicks.
  const ref = useRef(null)

  // State for our modal.
  const [isChannelsOpen, setIsChannelsOpen] = useState(false)

  // Create a toggle method that we will use for the menu button.
  const toggleChannelsMenu = () => setIsChannelsOpen(!isChannelsOpen)

  // Close the menu if the user clicks outside the ref element.
  useOnClickOutside(ref, () => setIsChannelsOpen(false))

  // Close the menu if the escape key is pressed.
  useOnKeydown('Escape', () => setIsChannelsOpen(false))

  return (
    <Box ref={ref} css={{ position: 'relative' }}>
      <MenuItem onClick={toggleChannelsMenu}>
        <Flex alignItems="center">
          <Box mr={1}>
            <FormattedMessage {...messages.menu_item_channels} />
          </Box>
          {isChannelsOpen ? <AngleUp width="0.6em" /> : <AngleDown width="0.6em" />}
        </Flex>
      </MenuItem>
      {isChannelsOpen && (
        <ChannelsMenu css={{ position: 'absolute', right: 0, 'z-index': '40' }} width={265} />
      )}
    </Box>
  )
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
      <ChannelsMenuItem />
      {isAutopayEnabled() && <AutopayMenuItem openModal={openModal} />}
      <SettingsMenu css={{ position: 'relative', 'z-index': '40' }} ml={4} />
    </Flex>
  )
}

WalletMenu.propTypes = {
  openModal: PropTypes.func.isRequired,
}

export default WalletMenu
