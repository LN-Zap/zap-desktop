import { connect } from 'react-redux'
import { activitySelectors } from 'reducers/activity'

import ActivityPlaceholderList from 'components/Activity/ActivityPlaceholderList'

const mapStateToProps = state => ({
  filter: activitySelectors.filter(state),
})

export default connect(mapStateToProps)(ActivityPlaceholderList)
