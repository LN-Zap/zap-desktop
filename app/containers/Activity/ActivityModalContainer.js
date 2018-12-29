import { connect } from 'react-redux'
import { hideActivityModal, activitySelectors } from 'reducers/activity'
import { ActivityModal } from 'components/Activity/ActivityModal'

const mapStateToProps = state => ({
  item: activitySelectors.activityModalItem(state)
})

const mapDispatchToProps = {
  hideActivityModal
}

export const ActivityModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityModal)
