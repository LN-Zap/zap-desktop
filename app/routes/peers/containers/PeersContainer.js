import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import Peers from '../components/Peers'

const mapDispatchToProps = {

}

const mapStateToProps = state => ({
  peers: state.peers
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Peers))
