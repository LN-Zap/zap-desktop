import React from 'react'

import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

import Refresh from 'components/Icon/Refresh'
import { ActionButton } from 'components/UI'

import messages from './messages'

const ChannelsRefresh = injectIntl(({ intl, onClick, ...rest }) => (
  <ActionButton
    hint={intl.formatMessage({ ...messages.refresh_button_hint })}
    onClick={onClick}
    px={2}
    {...rest}
  >
    <Refresh height="16px" width="16px" />
  </ActionButton>
))

ChannelsRefresh.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ChannelsRefresh
