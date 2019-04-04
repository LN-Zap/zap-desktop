import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import { StatusIndicator, Text } from 'components/UI'
import { WalletName } from 'components/Util'
import AngleUp from 'components/Icon/AngleUp'
import AngleDown from 'components/Icon/AngleDown'
import Menu from './Menu'
import Fiat from './Fiat'
import Locale from './Locale'
import Theme from './Theme'

const StyledText = styled(Text)`
  cursor: pointer;
  transition: all 0.25s;
  &:hover {
    opacity: 0.6;
  }
`

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
    const { activeSubMenu, fiatProps, localeProps, themeProps, setActiveSubMenu } = this.props
    switch (activeSubMenu) {
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
    const { activeWalletSettings, isSettingsOpen, ...rest } = this.props

    return (
      <Box {...rest}>
        <Flex
          ref={this.setButtonRef}
          alignItems="center"
          css={{ cursor: 'pointer' }}
          onClick={this.handleButtonClick}
        >
          <StatusIndicator mr={2} variant="online" />
          <Flex alignItems="center">
            <StyledText mr={1} textAlign="left">
              <WalletName wallet={activeWalletSettings} />
            </StyledText>
            {isSettingsOpen ? <AngleUp width="0.6em" /> : <AngleDown width="0.6em" />}
          </Flex>
        </Flex>
        <Box ref={this.setWrapperRef}>{isSettingsOpen && this.renderSettings()}</Box>
      </Box>
    )
  }
}

Settings.propTypes = {
  activeSubMenu: PropTypes.string,
  activeWalletSettings: PropTypes.object,
  closeSettings: PropTypes.func.isRequired,
  fiatProps: PropTypes.object.isRequired,
  isSettingsOpen: PropTypes.bool,
  localeProps: PropTypes.object.isRequired,
  openSettings: PropTypes.func.isRequired,
  setActiveSubMenu: PropTypes.func.isRequired,
  themeProps: PropTypes.object.isRequired,
}

export default Settings
