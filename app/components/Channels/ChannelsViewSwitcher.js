import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { Button } from 'components/UI'
import LayoutCards from 'components/Icon/LayoutCards'
import LayoutList from 'components/Icon/LayoutList'
import { CHANNEL_LIST_VIEW_MODE_SUMMARY, CHANNEL_LIST_VIEW_MODE_CARD } from './constants'
import messages from './messages'

const StyledButton = styled(Button)`
  color: ${props => (props.active ? props.theme.colors.lightningOrange : null)};
  &:hover {
    color: ${props => props.theme.colors.lightningOrange};
  }
`
StyledButton.propTypes = {
  active: PropTypes.bool,
}

const CardButton = injectIntl(({ active, onClick, intl, ...rest }) => (
  <StyledButton
    active={active}
    className="hint--bottom-left"
    data-hint={intl.formatMessage({ ...messages.view_mode_card })}
    onClick={onClick}
    size="small"
    variant="secondary"
    {...rest}
  >
    <LayoutCards height="16px" width="16px" />
  </StyledButton>
))

CardButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

const ListButton = injectIntl(({ active, onClick, intl, ...rest }) => (
  <StyledButton
    active={active}
    alignSelf="center"
    className="hint--bottom-left"
    data-hint={intl.formatMessage({ ...messages.view_mode_list })}
    onClick={onClick}
    size="small"
    variant="secondary"
    {...rest}
  >
    <LayoutList height="16px" width="16px" />
  </StyledButton>
))

ListButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

const ChannelsViewSwitcher = ({ channelViewMode, setChannelViewMode, ...rest }) => (
  <Flex alignItems="center" as="section" {...rest}>
    <CardButton
      active={channelViewMode === CHANNEL_LIST_VIEW_MODE_CARD}
      onClick={() => setChannelViewMode(CHANNEL_LIST_VIEW_MODE_CARD)}
      px={2}
      py={1}
    />
    <ListButton
      active={channelViewMode === CHANNEL_LIST_VIEW_MODE_SUMMARY}
      onClick={() => setChannelViewMode(CHANNEL_LIST_VIEW_MODE_SUMMARY)}
      px={2}
      py={1}
    />
  </Flex>
)

ChannelsViewSwitcher.propTypes = {
  channelViewMode: PropTypes.string.isRequired,
  setChannelViewMode: PropTypes.func.isRequired,
}

export default ChannelsViewSwitcher
