import reducer, {
  UPDATE_AUTOPAY_SEARCH_QUERY,
  SET_SELECTED_MERCHANT,
  ENABLE_AUTOPAY,
  DISABLE_AUTOPAY,
  SET_AUTOPAY_LIST,
  SET_EDIT_MODE,
  RESET_EDIT_MODE,
} from 'reducers/autopay'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('autopayReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle UPDATE_AUTOPAY_SEARCH_QUERY', () => {
      const action = {
        type: UPDATE_AUTOPAY_SEARCH_QUERY,
        searchQuery: 'some text',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_SELECTED_MERCHANT', () => {
      const action = {
        type: SET_SELECTED_MERCHANT,
        selectedMerchantId: '123',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle ENABLE_AUTOPAY', () => {
      const action = {
        type: ENABLE_AUTOPAY,
        data: { merchantId: '123', limit: '456' },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle DISABLE_AUTOPAY', () => {
      const action = {
        type: DISABLE_AUTOPAY,
        merchantId: '123',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_AUTOPAY_LIST', () => {
      const action = {
        type: SET_AUTOPAY_LIST,
        list: [
          {
            id: 'merchant-1',
            limit: '999',
          },
          {
            id: 'merchant-2',
            limit: '999',
          },
        ],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_EDIT_MODE', () => {
      const action = {
        type: SET_EDIT_MODE,
        isEditMode: true,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RESET_EDIT_MODE', () => {
      const action = {
        type: RESET_EDIT_MODE,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
