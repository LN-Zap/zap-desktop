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
  })
})