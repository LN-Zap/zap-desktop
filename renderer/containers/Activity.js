import { connect } from 'react-redux'
import { toggleExpiredRequests, activitySelectors } from 'reducers/activity'
import Activity from 'components/Activity'

const mapDispatchToProps = {
  toggleExpiredRequests,
}

const mapStateToProps = state => ({
  currentActivity: activitySelectors.currentActivity(state)(state),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity)
