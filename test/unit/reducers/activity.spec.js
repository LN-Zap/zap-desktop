import reducer, {
  SET_ACTIVITY_MODAL,
  HIDE_ACTIVITY_MODAL,
  CHANGE_FILTER,
  UPDATE_SEARCH_TEXT,
  FETCH_ACTIVITY_HISTORY,
  FETCH_ACTIVITY_HISTORY_SUCCESS,
  FETCH_ACTIVITY_HISTORY_FAILURE,
  SET_HAS_NEXT_PAGE,
  ADD_FILTER,
} from 'reducers/activity'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('activityReducer', () => {
    it('should handle SET_ACTIVITY_MODAL', () => {
      const action = {
        type: SET_ACTIVITY_MODAL,
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
        filterList: ['SENT_ACTIVITY'],
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

    it('should handle SET_HAS_NEXT_PAGE', () => {
      const action = {
        type: SET_HAS_NEXT_PAGE,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle ADD_FILTER', () => {
      const action = {
        type: ADD_FILTER,
        filterList: ['SENT_ACTIVITY'],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
