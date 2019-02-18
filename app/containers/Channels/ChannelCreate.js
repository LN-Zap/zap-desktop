import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setFormType } from 'reducers/form'
import ChannelCreateForm from './ChannelCreateForm'

class ChannelCreate extends React.Component {
  static propTypes = {
    setFormType: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const { setFormType } = this.props
    this.setFormType = setFormType.bind(this, 'CHANNELS')
  }

  render() {
    const { setFormType, ...rest } = this.props

    return <ChannelCreateForm onCancel={this.setFormType} onSubmit={this.setFormType} {...rest} />
  }
}

const mapDispatchToProps = {
  setFormType
}

export default connect(
  null,
  mapDispatchToProps
)(ChannelCreate)
