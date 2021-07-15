import React from 'react'

import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

import Refresh from 'components/Icon/Refresh'
import { ActionButton } from 'components/UI'

import messages from './messages'

const ActivityRefresh = ({ isPageLoading, onClick, ...rest }) => {
  const { formatMessage } = useIntl()
  return (
    <ActionButton
      hint={formatMessage({ ...messages.refresh_button_hint })}
      isLoading={isPageLoading}
      onClick={onClick}
      {...rest}
    >
      <Refresh height="16px" width="16px" />
    </ActionButton>
  )
}

ActivityRefresh.propTypes = {
  isPageLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

export default ActivityRefresh
