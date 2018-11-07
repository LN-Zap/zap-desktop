import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import styled, { withTheme } from 'styled-components'
import FaAngleDown from 'react-icons/lib/fa/angle-down'
import FaAngleUp from 'react-icons/lib/fa/angle-up'
import Check from 'components/Icon/Check'
import Text from 'components/UI/Text'

/**
 * Container
 */
const DropdownContainer = styled(Flex)({})
DropdownContainer.defaultProps = {
  flexDirection: 'column',
  flexWrap: 'none',
  position: 'relative'
}

/**
 * Button
 */
const DropdownButton = styled(Box)({
  appearance: 'none',
  display: 'inline-block',
  textAlign: 'center',
  lineHeight: 'inherit',
  textDecoration: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer'
})
DropdownButton.defaultProps = {
  as: 'button',
  m: 0,
  p: 0,
  textAlign: 'left',
  justify: 'left'
}

/**
 * Menu
 */
const MenuContainer = styled(Box)({
  position: 'relative'
})

const Menu = styled(Box)({
  cursor: 'pointer',
  display: 'inline-block',
  position: 'absolute',
  'z-index': '999',
  'min-width': '70px',
  'list-style-type': 'none',
  'border-radius': '3px',
  'box-shadow': '0 3px 4px 0 rgba(30, 30, 30, 0.5)'
})
Menu.defaultProps = {
  as: 'ul',
  m: 0,
  mt: 1,
  p: 0,
  bg: 'secondaryColor'
}

/**
 * MenuItem
 */
const MenuItem = styled(Box)`
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.colors.primaryColor};
  }
`
MenuItem.defaultProps = {
  as: 'li',
  px: 2,
  py: 2
}

/**
 * @render react
 * @name Dropdown
 * @example
 * <Dropdown items={[
 *    {name: 'Item 1', key: 'key1'},
 *    {name: 'Item 2', key: 'key2'}
 *  ]} activeKey="key1" />
 */
class Dropdown extends React.Component {
  state = {
    isOpen: false
  }
  onChange = this.onChange.bind(this)
  toggleMenu = this.toggleMenu.bind(this)
  setWrapperRef = this.setWrapperRef.bind(this)
  handleClickOutside = this.handleClickOutside.bind(this)

  static propTypes = {
    activeKey: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  onChange(key) {
    const { onChange, activeKey } = this.props
    if (key !== activeKey) {
      if (onChange) {
        onChange(key)
      }
    }
    this.setState({ isOpen: false })
  }

  setWrapperRef(node) {
    this.wrapperRef = node
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ isOpen: false })
    }
  }

  toggleMenu() {
    const { isOpen } = this.state
    this.setState({ isOpen: !isOpen })
  }

  render() {
    const { isOpen } = this.state
    let { activeKey, items, justify, theme, ...rest } = this.props
    // coerce array of strings into array of objects.
    items = items.map(item => {
      if (typeof item === 'string') {
        return {
          name: item,
          key: item
        }
      }
      return item
    })
    const selectedItem = items.find(c => c.key === activeKey)
    return (
      <DropdownContainer ref={this.setWrapperRef} {...rest}>
        <DropdownButton type="button" onClick={this.toggleMenu}>
          <Text textAlign="left">
            {selectedItem ? selectedItem.name : activeKey}{' '}
            {isOpen ? <FaAngleUp /> : <FaAngleDown />}
          </Text>
        </DropdownButton>
        {isOpen && (
          <MenuContainer>
            <Menu css={justify === 'right' ? { right: 0 } : null}>
              {items.map(item => {
                return (
                  <MenuItem key={item.key} onClick={() => this.onChange(item.key)}>
                    <Flex alignItems="center">
                      <Text width="20px" textAlign="center">
                        {activeKey === item.key && (
                          <Check height="0.95em" color={theme.colors.superGreen} />
                        )}
                      </Text>
                      <Text>{item.name}</Text>
                    </Flex>
                  </MenuItem>
                )
              })}
            </Menu>
          </MenuContainer>
        )}
      </DropdownContainer>
    )
  }
}

export default withTheme(Dropdown)
