import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Button, Dropdown, Spinner } from 'components/UI'

const NetworkActionBar = ({
  hasChannels,
  changeFilter,
  filters,
  activeKey,
  refreshClicked,
  isRefreshing,
  refreshMessage
}) =>
  hasChannels && (
    <Flex justifyContent="space-between" alignItems="center" mx={3} mb={3}>
      <Dropdown activeKey={activeKey} items={filters} onChange={changeFilter} />
      <Button size="small" variant="secondary" onClick={refreshClicked}>
        {isRefreshing ? <Spinner /> : <FormattedMessage {...refreshMessage} />}
      </Button>
    </Flex>
  )

NetworkActionBar.propTypes = {
  hasChannels: PropTypes.bool.isRequired,
  changeFilter: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  activeKey: PropTypes.string.isRequired,
  refreshClicked: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  refreshMessage: PropTypes.object.isRequired
}

export default NetworkActionBar
