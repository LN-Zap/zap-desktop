import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closeModal } from 'reducers/modal'
import ChannelCreateForm from './ChannelCreateForm'

class ChannelCreate extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired
  }

  render() {
    const { closeModal, ...rest } = this.props

    return <ChannelCreateForm onSubmit={closeModal} {...rest} />
  }
}

const mapDispatchToProps = {
  closeModal
}

export default connect(
  null,
  mapDispatchToProps
)(ChannelCreate)
