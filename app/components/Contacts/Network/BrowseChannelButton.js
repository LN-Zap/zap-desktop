import React from 'react'
import PropTypes from 'prop-types'
import ExternalLink from 'components/Icon/ExternalLink'
import { Button } from 'components/UI'

const BrowseChannelButton = ({ onClick }) => (
  <Button variant="secondary" size="small" ml="auto" px={0} py={0} onClick={onClick}>
    <ExternalLink />
  </Button>
)

BrowseChannelButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default BrowseChannelButton
