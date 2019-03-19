// @flow

import invoiceReducer, {
  SEARCH_INVOICES,
  SET_INVOICE,
  GET_INVOICE,
  RECEIVE_INVOICE,
  RECEIVE_FORM_INVOICE,
  GET_INVOICES,
  RECEIVE_INVOICES,
  SEND_INVOICE,
  INVOICE_SUCCESSFUL,
  INVOICE_FAILED,
} from 'reducers/invoice'

describe('reducers', () => {
  describe('invoiceReducer', () => {
    it('should handle initial state', () => {
      expect(invoiceReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have SEARCH_INVOICES', () => {
      expect(SEARCH_INVOICES).toEqual('SEARCH_INVOICES')
    })

    it('should have SET_INVOICE', () => {
      expect(SET_INVOICE).toEqual('SET_INVOICE')
    })

    it('should have GET_INVOICE', () => {
      expect(GET_INVOICE).toEqual('GET_INVOICE')
    })

    it('should have RECEIVE_INVOICE', () => {
      expect(RECEIVE_INVOICE).toEqual('RECEIVE_INVOICE')
    })

    it('should have RECEIVE_FORM_INVOICE', () => {
      expect(RECEIVE_FORM_INVOICE).toEqual('RECEIVE_FORM_INVOICE')
    })

    it('should have GET_INVOICES', () => {
      expect(GET_INVOICES).toEqual('GET_INVOICES')
    })

    it('should have RECEIVE_INVOICES', () => {
      expect(RECEIVE_INVOICES).toEqual('RECEIVE_INVOICES')
    })

    it('should have SEND_INVOICE', () => {
      expect(SEND_INVOICE).toEqual('SEND_INVOICE')
    })

    it('should have INVOICE_SUCCESSFUL', () => {
      expect(INVOICE_SUCCESSFUL).toEqual('INVOICE_SUCCESSFUL')
    })

    it('should have INVOICE_FAILED', () => {
      expect(INVOICE_FAILED).toEqual('INVOICE_FAILED')
    })

    it('should correctly searchInvoices', () => {
      expect(
        invoiceReducer(undefined, { type: SEARCH_INVOICES, invoicesSearchText: 'foo' })
      ).toMatchSnapshot()
    })

    it('should correctly setInvoice', () => {
      expect(invoiceReducer(undefined, { type: SET_INVOICE, invoice: 'foo' })).toMatchSnapshot()
    })

    it('should correctly getInvoice', () => {
      expect(invoiceReducer(undefined, { type: GET_INVOICE })).toMatchSnapshot()
    })

    it('should correctly receiveInvoice', () => {
      expect(invoiceReducer(undefined, { type: RECEIVE_INVOICE, invoice: 'foo' })).toMatchSnapshot()
    })

    it('should correctly receiveFormInvoice', () => {
      expect(
        invoiceReducer(undefined, { type: RECEIVE_FORM_INVOICE, formInvoice: { payreq: 'foo' } })
      ).toMatchSnapshot()
    })

    it('should correctly getInvoices', () => {
      expect(invoiceReducer(undefined, { type: GET_INVOICES })).toMatchSnapshot()
    })

    it('should correctly receiveInvoices', () => {
      expect(
        invoiceReducer(undefined, { type: RECEIVE_INVOICES, invoices: [1, 2] })
      ).toMatchSnapshot()
    })

    it('should correctly sendInvoice', () => {
      expect(invoiceReducer(undefined, { type: SEND_INVOICE })).toMatchSnapshot()
    })

    it('should correctly invcoiceSuccessful', () => {
      expect(
        invoiceReducer(undefined, { type: INVOICE_SUCCESSFUL, invoice: 'foo' })
      ).toMatchSnapshot()
    })

    it('should correctly invcoiceFailed', () => {
      expect(invoiceReducer(undefined, { type: INVOICE_FAILED })).toMatchSnapshot()
    })
  })
})
