import { connect } from 'react-redux'
import {
  changeFilter,
  fetchActivityHistory,
  updateSearchText,
  activitySelectors,
} from 'reducers/activity'
import ActivityActions from 'components/Activity/ActivityActions'

const mapDispatchToProps = {
  changeFilter,
  fetchActivityHistory,
  updateSearchText: updateSearchText,
}

const mapStateToProps = state => ({
  filter: activitySelectors.filter(state),
  filters: activitySelectors.filters(state),
  searchText: activitySelectors.searchText(state),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityActions)
