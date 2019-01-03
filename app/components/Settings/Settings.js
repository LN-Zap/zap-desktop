import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import Menu from './Menu'
import Fiat from './Fiat'
import Locale from './Locale'
import Theme from './Theme'

class Settings extends React.Component {
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  // Set the wrapper ref
  setWrapperRef = node => {
    this.wrapperRef = node
  }

  // Alert if clicked on outside of element
  handleClickOutside = event => {
    const { toggleSettings, settings } = this.props

    if (this.wrapperRef && !this.wrapperRef.contains(event.target) && settings.settingsOpen) {
      // Do not toggle the settings if they user clicked on their alias
      // as that will cause us to double toggle and re-open it
      if (
        typeof event.target.className === 'string' &&
        event.target.className.includes('settingsMenu')
      ) {
        return
      }

      // The user clicked outside of the settings box and not on the
      // alias so we should toggle the settings
      toggleSettings()
    }
  }

  renderSettings = () => {
    const { settings, fiatProps, localeProps, themeProps, setActiveSubMenu } = this.props

    switch (settings.activeSubMenu) {
      case 'fiat':
        return <Fiat {...fiatProps} />
      case 'locale':
        return <Locale {...localeProps} />
      case 'theme':
        return <Theme {...themeProps} />
      default:
        return <Menu setActiveSubMenu={setActiveSubMenu} />
    }
  }

  render() {
    return <Box ref={this.setWrapperRef}>{this.renderSettings()}</Box>
  }
}

Settings.propTypes = {
  settings: PropTypes.object.isRequired,
  setActiveSubMenu: PropTypes.func.isRequired,
  toggleSettings: PropTypes.func.isRequired,
  fiatProps: PropTypes.object.isRequired,
  localeProps: PropTypes.object.isRequired,
  themeProps: PropTypes.object.isRequired
}

export default Settings
