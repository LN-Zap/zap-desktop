import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { fetchDescribeNetwork } from 'reducers/network'

import Network from '../components/Network'

const mapDispatchToProps = {
  fetchDescribeNetwork
}

const mapStateToProps = state => ({
  network: state.network,
  identity_pubkey: state.info.data.identity_pubkey
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Network))
