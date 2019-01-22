import { connect } from 'react-redux'

import { tickerSelectors } from 'reducers/ticker'

import {
  showActivityModal,
  changeFilter,
  toggleExpiredRequests,
  activitySelectors,
  updateSearchActive,
  updateSearchText,
  fetchActivityHistory
} from 'reducers/activity'

import Activity from 'components/Activity'

const mapDispatchToProps = {
  changeFilter,
  fetchActivityHistory,
  showActivityModal,
  toggleExpiredRequests,
  updateSearchActive,
  updateSearchText
}

const mapStateToProps = state => ({
  activity: state.activity,
  currentActivity: activitySelectors.currentActivity(state)(state),
  currencyName: tickerSelectors.currencyName(state),
  currentTicker: tickerSelectors.currentTicker(state),
  showExpiredToggle: activitySelectors.showExpiredToggle(state),
  ticker: state.ticker
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity)
