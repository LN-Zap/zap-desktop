import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import styled, { withTheme } from 'styled-components'
import { themeGet } from '@styled-system/theme-get'
import { opacity, fontWeight } from 'styled-system'
import { useOnClickOutside, useIntl as useIntlMapper, useMaxScreenHeight } from 'hooks'
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
export const DropdownButton = styled(Box)`
  ${opacity}
  ${fontWeight}
  appearance:none;
  display: inline-block;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: ${themeGet('fonts.sans')};
`

DropdownButton.defaultProps = {
  as: 'button',
  m: 0,
  p: 0,
  textAlign: 'left',
  justify: 'left',
  fontSize: 'm',
  lineHeight: 'normal',
  fontWeight: 'normal',
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
  max-height: ${props => props.maxHeight}px;
  overflow-y: auto;
  list-style-type: none;
  border-radius: 3px;
  box-shadow: ${themeGet('shadows.s')};
  right: ${props => (props.justify === 'right' ? 0 : null)};
`

Menu.defaultProps = {
  as: 'ul',
  m: 0,
  mt: 1,
  p: 0,
  bg: 'secondaryColor',
}

const MenuItemText = styled(Box)`
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: ${themeGet('colors.primaryColor')};
  }
`

MenuItemText.defaultProps = {
  as: 'li',
  px: 2,
  py: 2,
}

/**
 * MenuItem
 */
export const MenuItem = withTheme(
  ({ item, onClick, active, theme, hasParent, hasChildren, valueField, ...rest }) => (
    <MenuItemText key={item.key} onClick={() => onClick(item.key)} {...rest}>
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
        <Text mr={2}>{item[valueField]}</Text>

        <Flex alignItems="center" color="gray" justifyContent="flex-end" ml="auto" width="20px">
          {hasChildren && <AngleRight height="8px" />}
        </Flex>
      </Flex>
    </MenuItemText>
  )
)

const Dropdown = ({
  activeKey,
  items,
  justify,
  theme,
  buttonOpacity,
  onChange,
  messageMapper,
  valueField,
  ...rest
}) => {
  const intl = useIntl()
  // State to track dropdown open state.
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  // Close the dropdown if the user clicks outside our elements.
  const wrapperRef = useRef(null)
  useOnClickOutside([wrapperRef], () => setIsOpen(false))

  const [measuredRef, maxHeight] = useMaxScreenHeight(300)
  const height = maxHeight < 150 ? undefined : maxHeight
  // coerce array of strings into array of objects.
  let itemsArray = items.map(item => {
    if (typeof item === 'string') {
      return {
        [valueField]: item,
        key: item,
      }
    }
    return item
  })

  itemsArray = useIntlMapper(itemsArray, messageMapper, intl)

  const selectedItem = itemsArray.find(c => c.key === activeKey)

  const handleClick = key => {
    if (key !== activeKey) {
      if (onChange) {
        onChange(key)
      }
    }
    setIsOpen(false)
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <DropdownContainer {...rest} ref={wrapperRef}>
        <DropdownButton
          fontWeight="normal"
          onClick={toggleMenu}
          opacity={buttonOpacity}
          type="button"
        >
          <Flex alignItems="center">
            <Text css="white-space: nowrap;" mr={1} textAlign="left">
              {selectedItem ? selectedItem[valueField] : activeKey}{' '}
            </Text>
            <Flex color="gray">
              {isOpen ? <AngleUp width="0.6em" /> : <AngleDown width="0.6em" />}
            </Flex>
          </Flex>
        </DropdownButton>
        {isOpen && (
          <MenuContainer>
            <Menu ref={measuredRef} justify={justify} maxHeight={height}>
              {itemsArray.map(item => {
                return (
                  <MenuItem
                    key={item.key}
                    active={activeKey === item.key}
                    item={item}
                    onClick={() => handleClick(item.key)}
                    valueField={valueField}
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

Dropdown.defaultProps = {
  valueField: 'value',
}

Dropdown.propTypes = {
  activeKey: PropTypes.string.isRequired,
  buttonOpacity: PropTypes.number,
  items: PropTypes.array.isRequired,
  justify: PropTypes.string,
  messageMapper: PropTypes.func,
  onChange: PropTypes.func,
  theme: PropTypes.object.isRequired,
  valueField: PropTypes.string,
}

export default withTheme(Dropdown)
