import formReducer, { SET_FORM_TYPE } from 'reducers/form'

describe('reducers', () => {
  describe('formReducer', () => {
    it('should handle initial state', () => {
      expect(formReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have SET_FORM_TYPE', () => {
      expect(SET_FORM_TYPE).toEqual('SET_FORM_TYPE')
    })

    it('should correctly setFormType', () => {
      expect(formReducer(undefined, { type: SET_FORM_TYPE, formType: 'FOO' })).toMatchSnapshot()
    })
  })
})
