import reducer, {
  QUERY_FEES,
  QUERY_FEES_SUCCESS,
  QUERY_FEES_FAILURE,
  QUERY_ROUTES,
  QUERY_ROUTES_SUCCESS,
  QUERY_ROUTES_FAILURE,
  SET_REDIRECT_PAY_REQ,
} from 'reducers/pay'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('payReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle QUERY_FEES', () => {
      const action = {
        type: QUERY_FEES,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle QUERY_FEES_SUCCESS', () => {
      const action = {
        type: QUERY_FEES_SUCCESS,
        onchainFees: {
          slow: 5,
          medium: 50,
          fast: 100,
        },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle QUERY_FEES_FAILURE', () => {
      const action = {
        type: QUERY_FEES_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle QUERY_ROUTES', () => {
      const action = {
        type: QUERY_ROUTES,
        pubKey: 'somepubkey',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle QUERY_ROUTES_SUCCESS', () => {
      const action = {
        type: QUERY_ROUTES_SUCCESS,
        routes: [{ some: 'data' }],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle QUERY_ROUTES_FAILURE', () => {
      const action = {
        type: QUERY_ROUTES_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_REDIRECT_PAY_REQ', () => {
      const action = {
        type: SET_REDIRECT_PAY_REQ,
        redirectPayReq: 'lightning:abc123',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
