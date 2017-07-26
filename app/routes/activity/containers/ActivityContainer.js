import { connect } from 'react-redux'
import { fetchActivity } from '../../../reducers/activity'
import Activity from '../components/Activity'

const mapDispatchToProps = {
	fetchActivity
}

const mapStateToProps = (state) => ({
	activity: state.activity
})

export default connect(mapStateToProps, mapDispatchToProps)(Activity)