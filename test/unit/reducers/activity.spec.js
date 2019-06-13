import reducer, {
  SHOW_ACTIVITY_MODAL,
  HIDE_ACTIVITY_MODAL,
  CHANGE_FILTER,
  UPDATE_SEARCH_TEXT,
  FETCH_ACTIVITY_HISTORY,
  FETCH_ACTIVITY_HISTORY_SUCCESS,
  FETCH_ACTIVITY_HISTORY_FAILURE,
} from 'reducers/activity'

describe('reducers', () => {
  describe('activityReducer', () => {
    it('should have SHOW_ACTIVITY_MODAL', () => {
      expect(SHOW_ACTIVITY_MODAL).toEqual('SHOW_ACTIVITY_MODAL')
    })

    it('should have HIDE_ACTIVITY_MODAL', () => {
      expect(HIDE_ACTIVITY_MODAL).toEqual('HIDE_ACTIVITY_MODAL')
    })

    it('should have CHANGE_FILTER', () => {
      expect(CHANGE_FILTER).toEqual('CHANGE_FILTER')
    })

    it('should have UPDATE_SEARCH_TEXT', () => {
      expect(UPDATE_SEARCH_TEXT).toEqual('UPDATE_SEARCH_TEXT')
    })

    it('should have FETCH_ACTIVITY_HISTORY', () => {
      expect(FETCH_ACTIVITY_HISTORY).toEqual('FETCH_ACTIVITY_HISTORY')
    })

    it('should have FETCH_ACTIVITY_HISTORY_SUCCESS', () => {
      expect(FETCH_ACTIVITY_HISTORY_SUCCESS).toEqual('FETCH_ACTIVITY_HISTORY_SUCCESS')
    })

    it('should have FETCH_ACTIVITY_HISTORY_FAILURE', () => {
      expect(FETCH_ACTIVITY_HISTORY_FAILURE).toEqual('FETCH_ACTIVITY_HISTORY_FAILURE')
    })

    it('should handle SHOW_ACTIVITY_MODAL', () => {
      expect(reducer(undefined, { type: SHOW_ACTIVITY_MODAL })).toMatchSnapshot()
    })

    it('should handle HIDE_ACTIVITY_MODAL', () => {
      expect(reducer(undefined, { type: HIDE_ACTIVITY_MODAL, invoices: [1, 2] })).toMatchSnapshot()
    })

    it('should handle CHANGE_FILTER', () => {
      expect(reducer(undefined, { type: CHANGE_FILTER })).toMatchSnapshot()
    })

    it('should handle FETCH_ACTIVITY_HISTORY', () => {
      const action = {
        type: FETCH_ACTIVITY_HISTORY,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle FETCH_ACTIVITY_HISTORY_SUCCESS', () => {
      const action = {
        type: FETCH_ACTIVITY_HISTORY_SUCCESS,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle FETCH_ACTIVITY_HISTORY_FAILURE', () => {
      const action = {
        type: FETCH_ACTIVITY_HISTORY_FAILURE,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })
  })
})
