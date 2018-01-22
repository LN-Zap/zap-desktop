import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import Help from '../components/Help'

const mapDispatchToProps = {}

const mapStateToProps = () => ({})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Help))
