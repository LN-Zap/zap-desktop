import peersReducer, { FETCH_PEERS, FETCH_PEERS_SUCCESS } from 'reducers/peers'

describe('reducers', () => {
  describe('peersReducer', () => {
    it('should handle initial state', () => {
      expect(peersReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have FETCH_PEERS', () => {
      expect(FETCH_PEERS).toEqual('FETCH_PEERS')
    })

    it('should have FETCH_PEERS_SUCCESS', () => {
      expect(FETCH_PEERS_SUCCESS).toEqual('FETCH_PEERS_SUCCESS')
    })

    it('should correctly getPeers', () => {
      expect(peersReducer(undefined, { type: FETCH_PEERS })).toMatchSnapshot()
    })

    it('should correctly receivePeers', () => {
      expect(peersReducer(undefined, { type: FETCH_PEERS_SUCCESS, peers: 'foo' })).toMatchSnapshot()
    })
  })
})
