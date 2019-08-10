import reducer, {
  FETCH_ADDRESSES,
  FETCH_ADDRESSES_SUCCESS,
  NEW_ADDRESS,
  NEW_ADDRESS_SUCCESS,
  NEW_ADDRESS_FAILURE,
  OPEN_WALLET_MODAL,
  CLOSE_WALLET_MODAL,
} from 'reducers/address'

describe('reducers', () => {
  describe('addressReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle FETCH_ADDRESSES', () => {
      const action = {
        type: FETCH_ADDRESSES,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle FETCH_ADDRESSES_SUCCESS', () => {
      const action = {
        type: FETCH_ADDRESSES_SUCCESS,
        addresses: {
          np2wkh: '375WLnZzkEwKddQW22SGyhCfXNFz32Gvfc',
          p2wkh: 'bc1q7l2z25nle43ngzzr86p2fwr2xlvtdkzm74e3tz',
        },
      }
      expect(reducer(undefined, action)).toMatchSnapshot()
    })

    it('should handle NEW_ADDRESS', () => {
      const action = {
        type: NEW_ADDRESS,
        addressType: 'p2wkh',
      }
      expect(reducer(undefined, action)).toMatchSnapshot()
    })

    it('should handle NEW_ADDRESS_SUCCESS', () => {
      const action = {
        type: NEW_ADDRESS_SUCCESS,
        addressType: 'np2wkh',
        address: '375WLnZzkEwKddQW22SGyhCfXNFz32Gvfc',
      }
      expect(reducer(undefined, action)).toMatchSnapshot()
    })

    it('should handle NEW_ADDRESS_FAILURE', () => {
      const action = {
        type: NEW_ADDRESS_FAILURE,
        addressType: 'np2wkh',
        error: 'some error',
      }
      expect(reducer(undefined, action)).toMatchSnapshot()
    })

    it('should handle OPEN_WALLET_MODAL', () => {
      const action = {
        type: OPEN_WALLET_MODAL,
      }
      expect(reducer(undefined, action)).toMatchSnapshot()
    })

    it('should handle CLOSE_WALLET_MODAL', () => {
      const action = {
        type: CLOSE_WALLET_MODAL,
      }
      expect(reducer(undefined, action)).toMatchSnapshot()
    })
  })
})
