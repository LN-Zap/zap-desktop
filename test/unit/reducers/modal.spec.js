import reducer, {
  OPEN_MODAL,
  CLOSE_MODAL,
  CLOSE_ALL_MODALS,
  SET_MODALS,
  OPEN_DIALOG,
  CLOSE_DIALOG,
} from 'reducers/modal'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('modalReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle OPEN_MODAL', () => {
      const action = {
        type: OPEN_MODAL,
        modal: {
          id: '123',
          some: 'data',
        },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle CLOSE_MODAL', () => {
      const action = {
        type: CLOSE_MODAL,
        id: '123',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle CLOSE_ALL_MODALS', () => {
      const action = {
        type: CLOSE_ALL_MODALS,
        modal: { id: '123', some: 'data' },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_MODALS', () => {
      const action = {
        type: SET_MODALS,
        modals: [
          { id: 'modala', some: 'data' },
          { id: 'modalb', some: 'data' },
        ],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle OPEN_DIALOG', () => {
      const action = {
        type: OPEN_DIALOG,
        id: 'dialog1',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle CLOSE_DIALOG', () => {
      const action = {
        type: CLOSE_DIALOG,
        id: 'dialog1',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
