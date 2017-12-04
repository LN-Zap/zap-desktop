import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import Network from '../components/Network'

const mapDispatchToProps = {}

const mapStateToProps = state => ({
  network: state.network
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Network))
