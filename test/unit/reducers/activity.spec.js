import activityReducer, {
  SHOW_ACTIVITY_MODAL,
  HIDE_ACTIVITY_MODAL,
  CHANGE_FILTER,
  TOGGLE_PULLDOWN,
  UPDATE_SEARCH_ACTIVE,
  UPDATE_SEARCH_TEXT
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

    it('should have TOGGLE_PULLDOWN', () => {
      expect(TOGGLE_PULLDOWN).toEqual('TOGGLE_PULLDOWN')
    })

    it('should have UPDATE_SEARCH_ACTIVE', () => {
      expect(UPDATE_SEARCH_ACTIVE).toEqual('UPDATE_SEARCH_ACTIVE')
    })

    it('should have UPDATE_SEARCH_TEXT', () => {
      expect(UPDATE_SEARCH_TEXT).toEqual('UPDATE_SEARCH_TEXT')
    })

    it('should correctly showActivityModal', () => {
      expect(activityReducer(undefined, { type: SHOW_ACTIVITY_MODAL })).toMatchSnapshot()
    })

    it('should correctly hideActivityModal', () => {
      expect(
        activityReducer(undefined, { type: HIDE_ACTIVITY_MODAL, invoices: [1, 2] })
      ).toMatchSnapshot()
    })

    it('should correctly changeFilter', () => {
      expect(activityReducer(undefined, { type: CHANGE_FILTER })).toMatchSnapshot()
    })

    it('should correctly togglePulldown', () => {
      expect(
        activityReducer(undefined, { type: TOGGLE_PULLDOWN, invoice: 'foo' })
      ).toMatchSnapshot()
    })

    it('should correctly updateSearchActive', () => {
      expect(activityReducer(undefined, { type: UPDATE_SEARCH_ACTIVE })).toMatchSnapshot()
    })

    it('should correctly updateSearchText', () => {
      expect(activityReducer(undefined, { type: UPDATE_SEARCH_TEXT })).toMatchSnapshot()
    })
  })
})
