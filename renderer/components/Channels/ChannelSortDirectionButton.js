import React from 'react'

import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

import ArrowDown from 'components/Icon/ArrowDown'
import ArrowUp from 'components/Icon/ArrowUp'
import { SwitchButton } from 'components/UI'

import messages from './messages'

const ChannelSortDirectionButton = injectIntl(({ onClick, isAsc, intl, ...rest }) => {
  return (
    <SwitchButton
      {...rest}
      data-hint={intl.formatMessage({
        ...(isAsc ? messages.channel_desc_sort : messages.channel_asc_sort),
      })}
      Icon1={ArrowUp}
      Icon2={ArrowDown}
      isSwitched={isAsc}
      onClick={onClick}
    />
  )
})

ChannelSortDirectionButton.propTypes = {
  isAsc: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default ChannelSortDirectionButton
