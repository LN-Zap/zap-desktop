import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { toggleExpiredRequests, activitySelectors } from 'reducers/activity'
import Activity from 'components/Activity'

const mapDispatchToProps = {
  toggleExpiredRequests,
}

const mapStateToProps = state => ({
  activity: state.activity,
  currentActivity: activitySelectors.currentActivity(state)(state),
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  currentTicker: tickerSelectors.currentTicker(state),
  ticker: state.ticker,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity)
