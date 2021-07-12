import reducer, {
  ENQUEUE_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
} from 'reducers/notification'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('notificationReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle ENQUEUE_NOTIFICATION', () => {
      const action = {
        type: ENQUEUE_NOTIFICATION,
        notification: { id: 123, message: 'some message' },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle REMOVE_NOTIFICATION', () => {
      const action = {
        type: REMOVE_NOTIFICATION,
        id: 123,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle UPDATE_NOTIFICATION', () => {
      const action = {
        type: UPDATE_NOTIFICATION,
        id: 123,
        options: {
          message: 'updated message',
        },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
