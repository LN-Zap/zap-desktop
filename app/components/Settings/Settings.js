import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { StatusIndicator, Text } from 'components/UI'
import { WalletName } from 'components/Util'
import AngleUp from 'components/Icon/AngleUp'
import AngleDown from 'components/Icon/AngleDown'
import Menu from './Menu'
import Fiat from './Fiat'
import Locale from './Locale'
import Theme from './Theme'

class Settings extends React.Component {
  menuRef = React.createRef()
  buttonRef = React.createRef()

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setButtonRef = node => {
    this.buttonRef = node
  }

  setWrapperRef = node => {
    this.menuRef = node
  }

  handleButtonClick = event => {
    const { isSettingsOpen, closeSettings, openSettings } = this.props
    if (this.buttonRef && this.buttonRef.contains(event.target)) {
      isSettingsOpen ? closeSettings() : openSettings()
    }
  }

  handleClickOutside = event => {
    const { isSettingsOpen, closeSettings } = this.props
    if (
      this.menuRef &&
      (this.menuRef && !this.menuRef.contains(event.target)) &&
      (this.buttonRef && !this.buttonRef.contains(event.target)) &&
      isSettingsOpen
    ) {
      closeSettings()
    }
  }

  renderSettings = () => {
    const {
      activeSubMenu,
      fiatProps,
      localeProps,
      themeProps,
      setActiveSubMenu,
      setFormType
    } = this.props
    switch (activeSubMenu) {
      case 'fiat':
        return <Fiat {...fiatProps} />
      case 'locale':
        return <Locale {...localeProps} />
      case 'theme':
        return <Theme {...themeProps} />
      default:
        return <Menu setActiveSubMenu={setActiveSubMenu} setFormType={setFormType} />
    }
  }

  render() {
    const { activeWalletSettings, isSettingsOpen, ...rest } = this.props

    return (
      <Box {...rest}>
        <Flex
          ref={this.setButtonRef}
          alignItems="center"
          css={{ cursor: 'pointer' }}
          onClick={this.handleButtonClick}
        >
          <StatusIndicator variant="online" mr={2} />
          <Flex alignItems="center">
            <Text textAlign="left" mr={1}>
              <WalletName wallet={activeWalletSettings} />
            </Text>
            {isSettingsOpen ? <AngleUp width="0.6em" /> : <AngleDown width="0.6em" />}
          </Flex>
        </Flex>
        <Box ref={this.setWrapperRef}>{isSettingsOpen && this.renderSettings()}</Box>
      </Box>
    )
  }
}

Settings.propTypes = {
  isSettingsOpen: PropTypes.bool,
  activeSubMenu: PropTypes.string,
  activeWalletSettings: PropTypes.object,
  fiatProps: PropTypes.object.isRequired,
  localeProps: PropTypes.object.isRequired,
  themeProps: PropTypes.object.isRequired,
  setActiveSubMenu: PropTypes.func.isRequired,
  setFormType: PropTypes.func.isRequired,
  openSettings: PropTypes.func.isRequired,
  closeSettings: PropTypes.func.isRequired
}

export default Settings
