import settingsReducer, {
  SET_SETTINGS_OPEN,
  SET_ACTIVE_SUBMENU,
  DISABLE_SUBMENU
} from 'reducers/settings'

describe('reducers', () => {
  describe('settingsReducer', () => {
    it('should handle initial state', () => {
      expect(settingsReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have SET_SETTINGS_OPEN', () => {
      expect(SET_SETTINGS_OPEN).toEqual('SET_SETTINGS_OPEN')
    })

    it('should have SET_ACTIVE_SUBMENU', () => {
      expect(SET_ACTIVE_SUBMENU).toEqual('SET_ACTIVE_SUBMENU')
    })

    it('should have DISABLE_SUBMENU', () => {
      expect(DISABLE_SUBMENU).toEqual('DISABLE_SUBMENU')
    })

    it('should correctly setSettingsOpen', () => {
      expect(
        settingsReducer(undefined, { type: SET_SETTINGS_OPEN, settingsOpen: true })
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
