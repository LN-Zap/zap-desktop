import reducer, { UPDATE_CONTACT_FORM_SEARCH_QUERY } from 'reducers/contactsform'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('contactsformReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle UPDATE_CONTACT_FORM_SEARCH_QUERY', () => {
      const action = {
        type: UPDATE_CONTACT_FORM_SEARCH_QUERY,
        searchQuery: 'some text',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
