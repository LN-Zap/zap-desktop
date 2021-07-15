import reducer, {
  SET_CHANNEL_VIEW_MODE,
  SET_SELECTED_CHANNEL,
  CHANGE_CHANNEL_FILTER,
  CHANGE_CHANNEL_SORT,
  CHANGE_CHANNEL_SORT_ORDER,
  UPDATE_SEARCH_QUERY,
  GET_CHANNELS,
  RECEIVE_CHANNELS,
  ADD_LOADING_PUBKEY,
  REMOVE_LOADING_PUBKEY,
  ADD_CLOSING_CHAN_ID,
  REMOVE_CLOSING_CHAN_ID,
  GET_SUGGESTED_NODES,
  RECEIVE_SUGGESTED_NODES_ERROR,
  RECEIVE_SUGGESTED_NODES,
} from 'reducers/channels'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('channelsReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle SET_CHANNEL_VIEW_MODE', () => {
      const action = {
        type: SET_CHANNEL_VIEW_MODE,
        viewMode: 'list',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_SELECTED_CHANNEL', () => {
      const action = {
        type: SET_SELECTED_CHANNEL,
        selectedChannelId: '1',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle CHANGE_CHANNEL_FILTER', () => {
      const action = {
        type: CHANGE_CHANNEL_FILTER,
        filter: 'NON_ACTIVE_CHANNELS',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle CHANGE_CHANNEL_SORT', () => {
      const action = {
        type: CHANGE_CHANNEL_SORT,
        sort: 'CHANNELS_SORT_CAPACITY',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle CHANGE_CHANNEL_SORT_ORDER', () => {
      const action = {
        type: CHANGE_CHANNEL_SORT_ORDER,
        sortOrder: 'desc',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle UPDATE_SEARCH_QUERY', () => {
      const action = {
        type: UPDATE_SEARCH_QUERY,
        searchQuery: 'some text',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle GET_CHANNELS', () => {
      const action = {
        type: GET_CHANNELS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_CHANNELS', () => {
      const action = {
        type: RECEIVE_CHANNELS,
        channels: [1, 2],
        pendingChannels: {
          pendingClosingChannels: [1],
          pendingForceClosingChannels: [2],
          pendingOpenChannels: [3],
          totalLimboBalance: 4,
          waitingCloseChannels: [5],
        },
        closedChannels: [5, 6],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle ADD_LOADING_PUBKEY', () => {
      const action = {
        type: ADD_LOADING_PUBKEY,
        data: {
          nodePubkey: '123',
        },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle REMOVE_LOADING_PUBKEY', () => {
      const action = {
        type: REMOVE_LOADING_PUBKEY,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle ADD_CLOSING_CHAN_ID', () => {
      const action = {
        type: ADD_CLOSING_CHAN_ID,
        chanId: '123',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle REMOVE_CLOSING_CHAN_ID', () => {
      const action = {
        type: REMOVE_CLOSING_CHAN_ID,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle GET_SUGGESTED_NODES', () => {
      const action = {
        type: GET_SUGGESTED_NODES,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_SUGGESTED_NODES_ERROR', () => {
      const action = {
        type: RECEIVE_SUGGESTED_NODES_ERROR,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_SUGGESTED_NODES', () => {
      const action = {
        type: RECEIVE_SUGGESTED_NODES,
        suggestedNodes: {
          some: 'data',
        },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
