import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'components/UI'

const ChannelSearch = ({ searchQuery, placeholder, updateChannelSearchQuery, ...rest }) => (
  <Form {...rest}>
    <Input
      field="channel-search"
      id="channel-search"
      type="search"
      placeholder={placeholder}
      initialValue={searchQuery}
      onValueChange={updateChannelSearchQuery}
      highlightOnValid={false}
      mr={2}
    />
  </Form>
)

ChannelSearch.propTypes = {
  searchQuery: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired
}

export default ChannelSearch
