import React, { useRef, useState } from 'react'

import { themeGet } from '@styled-system/theme-get'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import styled from 'styled-components'
import { opacity, fontWeight } from 'styled-system'

import AngleDown from 'components/Icon/AngleDown'
import AngleLeft from 'components/Icon/AngleLeft'
import AngleRight from 'components/Icon/AngleRight'
import AngleUp from 'components/Icon/AngleUp'
import Check from 'components/Icon/Check'
import { useOnClickOutside, useIntlMap, useMaxScreenHeight } from 'hooks'

import Text from '../Text'

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

export const MenuItem = ({
  item,
  onClick,
  isActive,
  hasParent,
  hasChildren,
  valueField,
  isMultiselect,
  ...rest
}) => {
  return (
    <MenuItemText onClick={() => onClick(item.key)} {...rest}>
      <Flex alignItems="center" pr={2}>
        {hasParent && (
          <Flex alignItems="center" color="gray" width="20px">
            <AngleLeft height="8px" />
          </Flex>
        )}
        {!hasParent && (
          <Text
            color={isMultiselect ? 'primaryAccent' : 'superGreen'}
            textAlign="center"
            width="20px"
          >
            {isActive && <Check height="0.95em" />}
          </Text>
        )}
        <Text mr={2}>{item[valueField]}</Text>

        <Flex alignItems="center" color="gray" justifyContent="flex-end" ml="auto" width="20px">
          {hasChildren && <AngleRight height="8px" />}
        </Flex>
      </Flex>
    </MenuItemText>
  )
}

MenuItem.propTypes = {
  hasChildren: PropTypes.bool,
  hasParent: PropTypes.bool,
  isActive: PropTypes.bool,
  isMultiselect: PropTypes.bool,
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  valueField: PropTypes.string,
}

const DefaultDropdownButton = ({
  onToggle,
  selectedItem,
  valueField,
  activeKey,
  isOpen,
  opacity: buttonOpacity,
}) => {
  return (
    <DropdownButton fontWeight="normal" onClick={onToggle} opacity={buttonOpacity} type="button">
      <Flex alignItems="center">
        <Text css="white-space: nowrap;" mr={1} textAlign="left">
          {selectedItem ? selectedItem[valueField] : activeKey}{' '}
        </Text>
        <Flex color="gray">{isOpen ? <AngleUp width="0.6em" /> : <AngleDown width="0.6em" />}</Flex>
      </Flex>
    </DropdownButton>
  )
}

DefaultDropdownButton.propTypes = {
  activeKey: PropTypes.string,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  opacity: PropTypes.number,
  selectedItem: PropTypes.object,
  valueField: PropTypes.string,
}

const Dropdown = ({
  activeKey,
  items,
  justify,
  buttonOpacity,
  onChange,
  messageMapper,
  valueField,
  isMultiselect,
  buttonComponent: ButtonComponent,
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

  itemsArray = useIntlMap(itemsArray, messageMapper, intl)

  const selectedItem = itemsArray.find(c => c.key === activeKey)

  const handleClick = key => {
    if (key !== activeKey || isMultiselect) {
      if (onChange) {
        onChange(key)
      }
    }
    !isMultiselect && setIsOpen(false)
  }

  const isActiveItem = key => {
    return activeKey === key || (isMultiselect && activeKey.has(key))
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <DropdownContainer {...rest} ref={wrapperRef}>
        <ButtonComponent
          {...{
            onToggle: toggleMenu,
            selectedItem,
            valueField,
            activeKey,
            isOpen,
            opacity: buttonOpacity,
          }}
        />
        {isOpen && (
          <MenuContainer>
            <Menu justify={justify} maxHeight={height} ref={measuredRef}>
              {itemsArray.map(item => {
                return (
                  <MenuItem
                    isActive={isActiveItem(item.key)}
                    isMultiselect={isMultiselect}
                    item={item}
                    key={item.key}
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
  buttonComponent: DefaultDropdownButton,
}

Dropdown.propTypes = {
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  buttonComponent: PropTypes.elementType,
  buttonOpacity: PropTypes.number,
  isMultiselect: PropTypes.bool,
  items: PropTypes.array.isRequired,
  justify: PropTypes.string,
  messageMapper: PropTypes.func,
  onChange: PropTypes.func,
  valueField: PropTypes.string,
}

export default Dropdown
