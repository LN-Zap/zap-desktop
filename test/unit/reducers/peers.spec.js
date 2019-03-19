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
  RECEIVE_PEERS,
} from 'reducers/peers'

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

    it('should correctly disconnectPeer', () => {
      expect(peersReducer(undefined, { type: DISCONNECT_PEER })).toMatchSnapshot()
    })

    it('should correctly disconnectSuccess', () => {
      expect(peersReducer(undefined, { type: DISCONNECT_SUCCESS, pubkey: 'foo' })).toMatchSnapshot()
    })

    it('should correctly disconnectFailure', () => {
      expect(peersReducer(undefined, { type: DISCONNECT_FAILURE })).toMatchSnapshot()
    })

    it('should correctly connectPeer', () => {
      expect(peersReducer(undefined, { type: CONNECT_PEER })).toMatchSnapshot()
    })

    it('should correctly connectSuccess', () => {
      expect(peersReducer(undefined, { type: CONNECT_SUCCESS, peer: 'foo' })).toMatchSnapshot()
    })

    it('should correctly connectFailure', () => {
      expect(peersReducer(undefined, { type: CONNECT_FAILURE })).toMatchSnapshot()
    })

    it('should correctly setPeerForm', () => {
      expect(peersReducer(undefined, { type: SET_PEER_FORM, form: 'foo' })).toMatchSnapshot()
    })

    it('should correctly setPeer', () => {
      expect(peersReducer(undefined, { type: SET_PEER, peer: 'foo' })).toMatchSnapshot()
    })

    it('should correctly getPeers', () => {
      expect(peersReducer(undefined, { type: GET_PEERS })).toMatchSnapshot()
    })

    it('should correctly receivePeers', () => {
      expect(peersReducer(undefined, { type: RECEIVE_PEERS, peers: 'foo' })).toMatchSnapshot()
    })
  })
})
