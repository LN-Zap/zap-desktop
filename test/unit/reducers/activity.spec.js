import snapshotDiff from '../__helpers__/snapshotDiff'
import reducer, {
  SHOW_ACTIVITY_MODAL,
  HIDE_ACTIVITY_MODAL,
  CHANGE_FILTER,
  UPDATE_SEARCH_TEXT,
  FETCH_ACTIVITY_HISTORY,
  FETCH_ACTIVITY_HISTORY_SUCCESS,
  FETCH_ACTIVITY_HISTORY_FAILURE,
  OPEN_ERROR_DETAILS_DIALOG,
  CLOSE_ERROR_DETAILS_DIALOG,
} from 'reducers/activity'

describe('reducers', () => {
  describe('activityReducer', () => {
    it('should handle SHOW_ACTIVITY_MODAL', () => {
      const action = {
        type: SHOW_ACTIVITY_MODAL,
        itemType: 'transaction',
        itemId: '123',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle HIDE_ACTIVITY_MODAL', () => {
      const action = {
        type: HIDE_ACTIVITY_MODAL,
        invoices: [1, 2],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle CHANGE_FILTER', () => {
      const action = {
        type: CHANGE_FILTER,
        filter: 'SENT_ACTIVITY',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle UPDATE_SEARCH_TEXT', () => {
      const action = {
        type: UPDATE_SEARCH_TEXT,
        searchText: 'some text',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle FETCH_ACTIVITY_HISTORY', () => {
      const action = {
        type: FETCH_ACTIVITY_HISTORY,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle FETCH_ACTIVITY_HISTORY_SUCCESS', () => {
      const action = {
        type: FETCH_ACTIVITY_HISTORY_SUCCESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle FETCH_ACTIVITY_HISTORY_FAILURE', () => {
      const action = {
        type: FETCH_ACTIVITY_HISTORY_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle OPEN_ERROR_DETAILS_DIALOG', () => {
      const action = {
        type: OPEN_ERROR_DETAILS_DIALOG,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle CLOSE_ERROR_DETAILS_DIALOG', () => {
      const action = {
        type: CLOSE_ERROR_DETAILS_DIALOG,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
