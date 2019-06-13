import { connect } from 'react-redux'
import { activitySelectors } from 'reducers/activity'
import Activity from 'components/Activity'

const mapStateToProps = state => ({
  currentActivity: activitySelectors.currentActivity(state)(state),
})

export default connect(mapStateToProps)(Activity)
