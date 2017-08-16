import peersReducer, {
  CONNECT_PEER,
  CONNECT_SUCCESS,
  CONNECT_FAILURE,
  DISCONNECT_PEER,
  DISCONNECT_SUCCESS,
  DISCONNECT_FAILURE,
  SET_PEER_FORM,
  SET_PEER,
  GET_PEERS,
  RECEIVE_PEERS
} from '../../app/reducers/peers'

describe('reducers', () => {
  describe('peersReducer', () => {
    it('should handle initial state', () => {
      expect(peersReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have CONNECT_PEER', () => {
      expect(CONNECT_PEER).toEqual('CONNECT_PEER')
    })

    it('should have CONNECT_SUCCESS', () => {
      expect(CONNECT_SUCCESS).toEqual('CONNECT_SUCCESS')
    })

    it('should have CONNECT_FAILURE', () => {
      expect(CONNECT_FAILURE).toEqual('CONNECT_FAILURE')
    })

    it('should have DISCONNECT_PEER', () => {
      expect(DISCONNECT_PEER).toEqual('DISCONNECT_PEER')
    })

    it('should have DISCONNECT_SUCCESS', () => {
      expect(DISCONNECT_SUCCESS).toEqual('DISCONNECT_SUCCESS')
    })

    it('should have DISCONNECT_FAILURE', () => {
      expect(DISCONNECT_FAILURE).toEqual('DISCONNECT_FAILURE')
    })

    it('should have SET_PEER_FORM', () => {
      expect(SET_PEER_FORM).toEqual('SET_PEER_FORM')
    })

    it('should have SET_PEER', () => {
      expect(SET_PEER).toEqual('SET_PEER')
    })

    it('should have GET_PEERS', () => {
      expect(GET_PEERS).toEqual('GET_PEERS')
    })

    it('should have RECEIVE_PEERS', () => {
      expect(RECEIVE_PEERS).toEqual('RECEIVE_PEERS')
    })

    // it('should correctly sendPayment', () => {
    //   expect(peersReducer(undefined, { type: SET_PAYMENT, payment: 'foo' })).toMatchSnapshot()
    // })
  })
})
