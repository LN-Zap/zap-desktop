import { connect } from 'react-redux'
import Node from '../components/Node'

const mapDispatchToProps = {}

const mapStateToProps = state => ({
  neutrino: state.neutrino
})

export default connect(mapStateToProps, mapDispatchToProps)(Node)
