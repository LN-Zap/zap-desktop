import infoReducer, { GET_INFO, RECEIVE_INFO } from 'reducers/info'

describe('reducers', () => {
  describe('infoReducer', () => {
    it('should handle initial state', () => {
      expect(infoReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have GET_INFO', () => {
      expect(GET_INFO).toEqual('GET_INFO')
    })

    it('should have RECEIVE_INFO', () => {
      expect(RECEIVE_INFO).toEqual('RECEIVE_INFO')
    })

    it('should correctly getInfo', () => {
      expect(infoReducer(undefined, { type: GET_INFO })).toMatchSnapshot()
    })

    it('should correctly receiveInfo', () => {
      expect(
        infoReducer(undefined, {
          type: RECEIVE_INFO,
          data: { semver: '0.5.2', chains: [{ chain: 'bitcoin', network: 'mainnet' }] }
        })
      ).toMatchSnapshot()
    })
  })
})
