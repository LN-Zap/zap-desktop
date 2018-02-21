/* eslint-disable */
// mock the app object of electron as electron-json-storage needs it
jest.mock('electron', () => ({ app: jest.fn() }))
import electron from 'electron'

import channelsReducer, {
  SET_CHANNEL_FORM,
  SET_CHANNEL,
  GET_CHANNELS,
  RECEIVE_CHANNELS,
  OPENING_CHANNEL,
  OPENING_SUCCESSFUL,
  OPENING_FAILURE
} from '../../app/reducers/channels'

describe('reducers', () => {
  describe('channelsReducer', () => {
    it('should handle initial state', () => {
      expect(channelsReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have SET_CHANNEL_FORM', () => {
      expect(SET_CHANNEL_FORM).toEqual('SET_CHANNEL_FORM')
    })

    it('should have SET_CHANNEL', () => {
      expect(SET_CHANNEL).toEqual('SET_CHANNEL')
    })

    it('should have GET_CHANNELS', () => {
      expect(GET_CHANNELS).toEqual('GET_CHANNELS')
    })

    it('should have RECEIVE_CHANNELS', () => {
      expect(RECEIVE_CHANNELS).toEqual('RECEIVE_CHANNELS')
    })

    it('should have OPENING_CHANNEL', () => {
      expect(OPENING_CHANNEL).toEqual('OPENING_CHANNEL')
    })

    it('should have OPENING_SUCCESSFUL', () => {
      expect(OPENING_SUCCESSFUL).toEqual('OPENING_SUCCESSFUL')
    })

    it('should have OPENING_FAILURE', () => {
      expect(OPENING_FAILURE).toEqual('OPENING_FAILURE')
    })

    it('should correctly setChannel', () => {
      expect(channelsReducer(undefined, { type: SET_CHANNEL, channel: 'channel' })).toMatchSnapshot()
    })

    it('should correctly setChannelForm', () => {
      expect(channelsReducer(undefined, { type: SET_CHANNEL_FORM, form: { isOpen: true } })).toMatchSnapshot()
    })

    it('should correctly getChannels', () => {
      expect(channelsReducer(undefined, { type: GET_CHANNELS })).toMatchSnapshot()
    })

    it('should correctly receiveChannel', () => {
      expect(channelsReducer(undefined, { type: RECEIVE_CHANNELS, channels: [1, 2], pendingChannels: [3, 4] })).toMatchSnapshot()
    })

    it('should correctly openingChannel', () => {
      expect(channelsReducer(undefined, { type: OPENING_CHANNEL })).toMatchSnapshot()
    })
  })
})
