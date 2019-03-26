import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import styled, { withTheme } from 'styled-components'
import { opacity } from 'styled-system'
import AngleLeft from 'components/Icon/AngleLeft'
import AngleRight from 'components/Icon/AngleRight'
import AngleUp from 'components/Icon/AngleUp'
import AngleDown from 'components/Icon/AngleDown'
import Check from 'components/Icon/Check'
import Text from './Text'

/**
 * Container
 */
const DropdownContainer = styled(Flex)({})
DropdownContainer.defaultProps = {
  flexDirection: 'column',
  flexWrap: 'none',
  position: 'relative',
}

/**
 * Button
 */
const ButtonBox = styled(Box)(opacity)
const DropdownButton = styled(ButtonBox)({
  appearance: 'none',
  display: 'inline-block',
  textAlign: 'center',
  lineHeight: 'inherit',
  textDecoration: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
})
DropdownButton.defaultProps = {
  as: 'button',
  m: 0,
  p: 0,
  textAlign: 'left',
  justify: 'left',
}

/**
 * Menu
 */
export const MenuContainer = styled(Box)`
  position: relative;
`

export const Menu = styled(Box)`
  cursor: pointer;
  display: inline-block;
  position: absolute;
  z-index: 40;
  min-width: 70px;
  max-height: 300px;
  overflow-y: auto;
  list-style-type: none;
  border-radius: 3px;
  box-shadow: 0 3px 4px 0 rgba(30, 30, 30, 0.5);
  right: ${props => (props.justify === 'right' ? 0 : null)};
`

Menu.defaultProps = {
  as: 'ul',
  m: 0,
  mt: 1,
  p: 0,
  bg: 'secondaryColor',
}

/**
 * MenuItem
 */
export const MenuItem = withTheme(
  ({ item, onClick, active, theme, hasParent, hasChildren, ...rest }) => (
    <Text
      key={item.key}
      as="li"
      css={{
        cursor: 'pointer',
        'white-space': 'nowrap',
        '&:hover': {
          'background-color': theme.colors.primaryColor,
        },
      }}
      onClick={() => onClick(item.key)}
      px={2}
      py={2}
      {...rest}
    >
      <Flex alignItems="center" pr={2}>
        {hasParent && (
          <Flex alignItems="center" color="gray" width="20px">
            <AngleLeft height="8px" />
          </Flex>
        )}
        {!hasParent && (
          <Text color="superGreen" textAlign="center" width="20px">
            {active && <Check height="0.95em" />}
          </Text>
        )}
        <Text mr={2}>{item.name}</Text>

        <Flex alignItems="center" color="gray" justifyContent="flex-end" ml="auto" width="20px">
          {hasChildren && <AngleRight height="8px" />}
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
    isOpen: false,
  }

  static propTypes = {
    activeKey: PropTypes.string.isRequired,
    buttonOpacity: PropTypes.number,
    items: PropTypes.array.isRequired,
    justify: PropTypes.string,
    onChange: PropTypes.func,
    theme: PropTypes.object.isRequired,
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
    let { activeKey, items, justify, theme, buttonOpacity, ...rest } = this.props
    // coerce array of strings into array of objects.
    items = items.map(item => {
      if (typeof item === 'string') {
        return {
          name: item,
          key: item,
        }
      }
      return item
    })
    const selectedItem = items.find(c => c.key === activeKey)
    return (
      <div style={{ display: 'inline-block' }}>
        <DropdownContainer ref={this.setWrapperRef} {...rest}>
          <DropdownButton onClick={this.toggleMenu} opacity={buttonOpacity} type="button">
            <Flex alignItems="center">
              <Text mr={1} textAlign="left">
                {selectedItem ? selectedItem.name : activeKey}{' '}
              </Text>
              {isOpen ? <AngleUp width="0.6em" /> : <AngleDown width="0.6em" />}
            </Flex>
          </DropdownButton>
          {isOpen && (
            <MenuContainer>
              <Menu justify={justify}>
                {items.map(item => {
                  return (
                    <MenuItem
                      key={item.key}
                      active={activeKey === item.key}
                      item={item}
                      onClick={() => this.handleClick(item.key)}
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
