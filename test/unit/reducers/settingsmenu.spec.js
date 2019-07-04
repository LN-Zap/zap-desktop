import settingsReducer, { OPEN_SETTINGS, CLOSE_SETTINGS } from 'reducers/settingsmenu'

describe('reducers', () => {
  describe('settingsReducer', () => {
    it('should handle initial state', () => {
      expect(settingsReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have OPEN_SETTINGS', () => {
      expect(OPEN_SETTINGS).toEqual('OPEN_SETTINGS')
    })

    it('should have CLOSE_SETTINGS', () => {
      expect(CLOSE_SETTINGS).toEqual('CLOSE_SETTINGS')
    })

    it('should correctly openSettings', () => {
      expect(
        settingsReducer(undefined, { type: OPEN_SETTINGS, settingsOpen: true })
      ).toMatchSnapshot()
    })

    it('should correctly closeSettingsMenu', () => {
      expect(
        settingsReducer(undefined, {
          type: CLOSE_SETTINGS,
          settingsOpen: false,
          activeSubMenu: null,
        })
      ).toMatchSnapshot()
    })
  })
})
