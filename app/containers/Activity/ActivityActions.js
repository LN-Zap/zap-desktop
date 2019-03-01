import { connect } from 'react-redux'
import { changeFilter, fetchActivityHistory, updateSearchText } from 'reducers/activity'
import ActivityActions from 'components/Activity/ActivityActions'

const mapDispatchToProps = {
  changeFilter,
  fetchActivityHistory,
  updateActivitySearchQuery: updateSearchText
}

const mapStateToProps = state => ({
  filter: state.activity.filter,
  filters: state.activity.filters,
  searchQuery: state.activity.searchText
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityActions)
