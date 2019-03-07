import settingsReducer, {
  OPEN_SETTINGS,
  CLOSE_SETTINGS,
  SET_ACTIVE_SUBMENU,
  DISABLE_SUBMENU
} from 'reducers/settingsmenu'

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

    it('should have SET_ACTIVE_SUBMENU', () => {
      expect(SET_ACTIVE_SUBMENU).toEqual('SET_ACTIVE_SUBMENU')
    })

    it('should have DISABLE_SUBMENU', () => {
      expect(DISABLE_SUBMENU).toEqual('DISABLE_SUBMENU')
    })

    it('should correctly openSettings', () => {
      expect(
        settingsReducer(undefined, { type: OPEN_SETTINGS, settingsOpen: true })
      ).toMatchSnapshot()
    })

    it('should correctly closeSettings', () => {
      expect(
        settingsReducer(undefined, {
          type: CLOSE_SETTINGS,
          settingsOpen: false,
          activeSubMenu: null
        })
      ).toMatchSnapshot()
    })

    it('should correctly setActiveSubmenu', () => {
      expect(
        settingsReducer(undefined, { type: SET_ACTIVE_SUBMENU, activeSubMenu: true })
      ).toMatchSnapshot()
    })

    it('should correctly disableSubmenu', () => {
      expect(settingsReducer(undefined, { type: DISABLE_SUBMENU })).toMatchSnapshot()
    })
  })
})
