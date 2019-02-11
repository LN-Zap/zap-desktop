import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import styled, { withTheme } from 'styled-components'
import AngleLeft from 'components/Icon/AngleLeft'
import AngleRight from 'components/Icon/AngleRight'
import AngleUp from 'components/Icon/AngleUp'
import AngleDown from 'components/Icon/AngleDown'
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
export const MenuContainer = styled(Box)({
  position: 'relative'
})

export const Menu = styled(Box)({
  cursor: 'pointer',
  display: 'inline-block',
  position: 'absolute',
  'z-index': '40',
  'min-width': '70px',
  'max-height': '300px',
  'overflow-y': 'auto',
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
export const MenuItem = withTheme(
  ({ item, onClick, active, theme, hasParent, hasChildren, ...rest }) => (
    <Text
      as="li"
      px={2}
      py={2}
      css={{
        cursor: 'pointer',
        'white-space': 'nowrap',
        '&:hover': {
          'background-color': theme.colors.primaryColor
        }
      }}
      key={item.key}
      onClick={() => onClick(item.key)}
      {...rest}
    >
      <Flex alignItems="center" pr={2}>
        {hasParent && (
          <Flex alignItems="center" width="20px" color="gray">
            <AngleLeft />
          </Flex>
        )}
        {!hasParent && (
          <Text width="20px" textAlign="center" color="superGreen">
            {active && <Check height="0.95em" />}
          </Text>
        )}
        <Text mr={2}>{item.name}</Text>

        <Flex alignItems="center" justifyContent="flex-end" width="20px" color="gray" ml="auto">
          {hasChildren && <AngleRight />}
        </Flex>
      </Flex>
    </Text>
  )
)

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

  static propTypes = {
    theme: PropTypes.object.isRequired,
    justify: PropTypes.string,
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

  setWrapperRef = node => {
    this.wrapperRef = node
  }

  handleClick = key => {
    const { onChange, activeKey } = this.props
    if (key !== activeKey) {
      if (onChange) {
        onChange(key)
      }
    }
    this.setState({ isOpen: false })
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ isOpen: false })
    }
  }

  toggleMenu = () => {
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
      <div style={{ display: 'inline-block' }}>
        <DropdownContainer ref={this.setWrapperRef} {...rest}>
          <DropdownButton type="button" onClick={this.toggleMenu}>
            <Flex alignItems="center">
              <Text textAlign="left" mr={1}>
                {selectedItem ? selectedItem.name : activeKey}{' '}
              </Text>
              {isOpen ? <AngleUp width="0.7em" /> : <AngleDown width="0.7em" />}
            </Flex>
          </DropdownButton>
          {isOpen && (
            <MenuContainer>
              <Menu css={justify === 'right' ? { right: 0 } : null}>
                {items.map(item => {
                  return (
                    <MenuItem
                      key={item.key}
                      item={item}
                      onClick={() => this.handleClick(item.key)}
                      active={activeKey === item.key}
                    />
                  )
                })}
              </Menu>
            </MenuContainer>
          )}
        </DropdownContainer>
      </div>
    )
  }
}

export default withTheme(Dropdown)
