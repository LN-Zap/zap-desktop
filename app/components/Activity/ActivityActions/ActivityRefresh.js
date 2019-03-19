import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import Sync from 'components/Icon/Sync'
import { ActionButton } from 'components/UI'
import messages from './messages'

const ActivityRefresh = injectIntl(({ intl, onClick, ...rest }) => (
  <ActionButton
    hint={intl.formatMessage({ ...messages.refresh_button_hint })}
    onClick={onClick}
    {...rest}
  >
    <Sync height="16px" width="16px" />
  </ActionButton>
))

ActivityRefresh.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ActivityRefresh
