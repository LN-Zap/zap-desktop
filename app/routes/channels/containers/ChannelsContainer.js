import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import Channels from '../components/Channels'

const mapDispatchToProps = {
}

const mapStateToProps = state => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Channels))
