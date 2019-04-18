import peersReducer, { GET_PEERS, RECEIVE_PEERS } from 'reducers/peers'

describe('reducers', () => {
  describe('peersReducer', () => {
    it('should handle initial state', () => {
      expect(peersReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have GET_PEERS', () => {
      expect(GET_PEERS).toEqual('GET_PEERS')
    })

    it('should have RECEIVE_PEERS', () => {
      expect(RECEIVE_PEERS).toEqual('RECEIVE_PEERS')
    })

    it('should correctly getPeers', () => {
      expect(peersReducer(undefined, { type: GET_PEERS })).toMatchSnapshot()
    })

    it('should correctly receivePeers', () => {
      expect(peersReducer(undefined, { type: RECEIVE_PEERS, peers: 'foo' })).toMatchSnapshot()
    })
  })
})
