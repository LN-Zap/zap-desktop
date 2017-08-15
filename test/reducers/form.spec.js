import formReducer, {
  SET_FORM,
  SET_AMOUNT,
  SET_MESSAGE,
  SET_PUBKEY,
  SET_PAYMENT_REQUEST,
  RESET_FORM
} from '../../app/reducers/form'

describe('reducers', () => {
  describe('formReducer', () => {
    it('should handle initial state', () => {
      expect(formReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have SET_FORM', () => {
      expect(SET_FORM).toEqual('SET_FORM')
    })

    it('should have SET_AMOUNT', () => {
      expect(SET_AMOUNT).toEqual('SET_AMOUNT')
    })

    it('should have SET_MESSAGE', () => {
      expect(SET_MESSAGE).toEqual('SET_MESSAGE')
    })

    it('should have SET_PUBKEY', () => {
      expect(SET_PUBKEY).toEqual('SET_PUBKEY')
    })

    it('should have SET_PAYMENT_REQUEST', () => {
      expect(SET_PAYMENT_REQUEST).toEqual('SET_PAYMENT_REQUEST')
    })

    it('should have RESET_FORM', () => {
      expect(RESET_FORM).toEqual('RESET_FORM')
    })

    it('should correctly setForm', () => {
      expect(formReducer(undefined, { type: SET_FORM, modalOpen: true, formType: 'foo' })).toMatchSnapshot()
    })

    it('should correctly setAmount', () => {
      expect(formReducer(undefined, { type: SET_AMOUNT, amount: 1 })).toMatchSnapshot()
    })

    it('should correctly setMessage', () => {
      expect(formReducer(undefined, { type: SET_MESSAGE, message: 'foo' })).toMatchSnapshot()
    })

    it('should correctly setPubkey', () => {
      expect(formReducer(undefined, { type: SET_PUBKEY, pubkey: 'foo' })).toMatchSnapshot()
    })

    it('should correctly setPaymentRequest', () => {
      expect(formReducer(undefined, { type: SET_PAYMENT_REQUEST, payment_request: 'foo' })).toMatchSnapshot()
    })

    it('should correctly resetForm', () => {
      expect(formReducer(undefined, { type: RESET_FORM })).toMatchSnapshot()
    })
  })
})