import React from 'react'
import PropTypes from 'prop-types'
import ChannelNodeSearch from 'containers/Channels/ChannelNodeSearch'
import ChannelCreateForm from 'containers/Channels/ChannelCreateForm'

class ChannelCreate extends React.Component {
  static propTypes = {
    isSearchValidNodeAddress: PropTypes.bool,
    searchQuery: PropTypes.string,
    onSubmit: PropTypes.func,
    updateContactFormSearchQuery: PropTypes.func.isRequired
  }

  componentWillUnmount() {
    const { updateContactFormSearchQuery } = this.props
    updateContactFormSearchQuery(null)
  }

  render() {
    const { onSubmit, searchQuery, isSearchValidNodeAddress, ...rest } = this.props

    return isSearchValidNodeAddress ? (
      <ChannelCreateForm onSubmit={onSubmit} {...rest} />
    ) : (
      <ChannelNodeSearch {...rest} />
    )
  }
}

export default ChannelCreate
