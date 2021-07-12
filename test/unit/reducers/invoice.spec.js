import reducer, {
  RECEIVE_INVOICES,
  ADD_INVOICE,
  ADD_INVOICE_SUCCESS,
  ADD_INVOICE_FAILURE,
  UPDATE_INVOICE,
} from 'reducers/invoice'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('invoiceReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle RECEIVE_INVOICES', () => {
      const action = {
        type: RECEIVE_INVOICES,
        invoices: [
          { rHash: '123', addIndex: 1 },
          { rHash: '456', addIndex: 2 },
        ],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle ADD_INVOICE', () => {
      const action = {
        type: ADD_INVOICE,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle ADD_INVOICE_SUCCESS', () => {
      const action = {
        type: ADD_INVOICE_SUCCESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle ADD_INVOICE_FAILURE', () => {
      const action = {
        type: ADD_INVOICE_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle UPDATE_INVOICE', () => {
      const action = {
        type: UPDATE_INVOICE,
        invoice: {
          rHash: '123',
        },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
