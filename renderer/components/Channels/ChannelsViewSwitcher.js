import React from 'react'

import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

import LayoutCards from 'components/Icon/LayoutCards'
import LayoutList from 'components/Icon/LayoutList'
import { SwitchButton } from 'components/UI'

import { CHANNEL_LIST_VIEW_MODE_SUMMARY, CHANNEL_LIST_VIEW_MODE_CARD } from './constants'
import messages from './messages'

const ChannelsViewSwitcher = injectIntl(
  ({ channelViewMode, setChannelViewMode, intl, ...rest }) => {
    const isCardView = channelViewMode === CHANNEL_LIST_VIEW_MODE_CARD
    //
    const onClick = () => {
      if (isCardView) {
        setChannelViewMode(CHANNEL_LIST_VIEW_MODE_SUMMARY)
      } else {
        setChannelViewMode(CHANNEL_LIST_VIEW_MODE_CARD)
      }
    }
    return (
      <SwitchButton
        {...rest}
        data-hint={intl.formatMessage({
          ...(isCardView ? messages.view_mode_list : messages.view_mode_card),
        })}
        Icon1={LayoutList}
        Icon2={LayoutCards}
        isSwitched={isCardView}
        onClick={onClick}
      />
    )
  }
)

ChannelsViewSwitcher.propTypes = {
  channelViewMode: PropTypes.string.isRequired,
  setChannelViewMode: PropTypes.func.isRequired,
}

export default ChannelsViewSwitcher
