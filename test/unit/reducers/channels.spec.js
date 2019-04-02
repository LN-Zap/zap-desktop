// @flow

import channelsReducer, {
  GET_CHANNELS,
  RECEIVE_CHANNELS,
  OPENING_SUCCESSFUL,
} from 'reducers/channels'

describe('reducers', () => {
  describe('channelsReducer', () => {
    it('should handle initial state', () => {
      expect(channelsReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have GET_CHANNELS', () => {
      expect(GET_CHANNELS).toEqual('GET_CHANNELS')
    })

    it('should have RECEIVE_CHANNELS', () => {
      expect(RECEIVE_CHANNELS).toEqual('RECEIVE_CHANNELS')
    })

    it('should have OPENING_SUCCESSFUL', () => {
      expect(OPENING_SUCCESSFUL).toEqual('OPENING_SUCCESSFUL')
    })

    it('should correctly getChannels', () => {
      expect(channelsReducer(undefined, { type: GET_CHANNELS })).toMatchSnapshot()
    })

    it('should correctly receiveChannel', () => {
      expect(
        channelsReducer(undefined, {
          type: RECEIVE_CHANNELS,
          channels: [1, 2],
          pendingChannels: [3, 4],
        })
      ).toMatchSnapshot()
    })
  })
})
