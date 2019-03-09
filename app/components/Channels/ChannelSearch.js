import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'components/UI'

const ChannelSearch = ({ searchQuery, placeholder, updateChannelSearchQuery, ...rest }) => (
  <Form {...rest}>
    <Input
      field="channel-search"
      highlightOnValid={false}
      id="channel-search"
      initialValue={searchQuery}
      mr={2}
      onValueChange={updateChannelSearchQuery}
      placeholder={placeholder}
      type="search"
    />
  </Form>
)

ChannelSearch.propTypes = {
  placeholder: PropTypes.string.isRequired,
  searchQuery: PropTypes.string,
  updateChannelSearchQuery: PropTypes.func.isRequired,
}

export default ChannelSearch
