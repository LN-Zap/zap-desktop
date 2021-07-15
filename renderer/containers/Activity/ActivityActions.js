import { connect } from 'react-redux'

import ActivityActions from 'components/Activity/ActivityActions'
import {
  changeFilter,
  reloadActivityHistory,
  updateSearchText,
  activitySelectors,
} from 'reducers/activity'

const mapDispatchToProps = {
  changeFilter,
  reloadActivityHistory,
  updateSearchText,
}

const mapStateToProps = state => ({
  filter: activitySelectors.filter(state),
  filters: activitySelectors.filters(state),
  searchText: activitySelectors.searchText(state),
  isCustomFilter: activitySelectors.isCustomFilter(state),
  isPageLoading: activitySelectors.isPageLoading(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityActions)
