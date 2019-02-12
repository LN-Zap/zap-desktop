import React from 'react'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import styled, { withTheme } from 'styled-components'
import Downshift from 'downshift'
import { Box, Flex } from 'rebass'
import system from '@rebass/components'
import { Input, Text } from 'components/UI'
import Check from 'components/Icon/Check'
import AngleUp from 'components/Icon/AngleUp'
import AngleDown from 'components/Icon/AngleDown'

const SelectOptionList = styled.ul`
  padding: 0;
  margin-top: 4px;
  position: absolute;
  z-index: 2;
  width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  background-color: ${props => props.theme.colors.secondaryColor};
  border-radius: 5px;
  box-shadow: 0 3px 4px 0 rgba(30, 30, 30, 0.5);
`

const SelectOptionItem = styled(
  system(
    {
      extend: Box,
      as: 'li',
      p: 2
    },
    'space',
    'color'
  )
)`
  outline: none;
  cursor: pointer;
`

const getIconStyles = props => `
  margin-left: -${props.width + 16}px;
  width: ${props.width}px;
  pointer-events: none;
  color: ${props.color || props.theme.colors.gray};
`

const ArrowIconClosed = styled(AngleDown)`
  ${props => getIconStyles(props)}
`

const ArrowIconOpen = styled(AngleUp)`
  ${props => getIconStyles(props)}
`

const StyledInput = styled(Input)`
  input {
    cursor: pointer;
    color: transparent;
    text-shadow: 0 0 0 ${props => props.color || props.theme.colors.primaryText};
  }
`

const itemToString = item => (item ? item.value : '')

/**
 * @render react
 * @name Select
 */
class Select extends React.PureComponent {
  static displayName = 'Select'

  static propTypes = {
    color: PropTypes.string,
    iconSize: PropTypes.number,
    initialSelectedItem: PropTypes.string,
    items: PropTypes.array,
    theme: PropTypes.object.isRequired,
    fieldApi: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
    onValueSelected: PropTypes.func.isRequired
  }

  static defaultProps = {
    items: [],
    iconSize: 8
  }

  inputRef = React.createRef()

  blurInput = () => {
    if (this.inputRef.current) {
      this.inputRef.current.blur()
    }
  }

  renderSelectOptions = (highlightedIndex, selectedItem, getItemProps) => {
    let { items, theme } = this.props

    return items.map((item, index) => (
      <SelectOptionItem
        key={item.key}
        {...getItemProps({
          key: item.key,
          index,
          item
        })}
        bg={highlightedIndex === index ? theme.colors.primaryColor : null}
        p={2}
      >
        <Flex alignItems="center" pr={2}>
          <Text width="20px" textAlign="center" color="superGreen">
            {selectedItem.key === item.key && <Check height="0.95em" />}
          </Text>
          <Text>{item.value}</Text>
        </Flex>
      </SelectOptionItem>
    ))
  }

  render() {
    let {
      fieldApi,
      iconSize,
      items,
      theme,
      color,
      onValueSelected,
      initialSelectedItem,
      ...rest
    } = this.props
    const { setValue, setTouched } = fieldApi

    let initialInputValue
    if (initialSelectedItem) {
      initialSelectedItem = items.find(i => i.key === initialSelectedItem)
      initialInputValue = itemToString(initialSelectedItem)
    }

    return (
      <Downshift
        itemToString={itemToString}
        // When an item is selected, set the item in the Informed form state.
        onSelect={item => {
          setValue(item.value)
          setTouched(true)
          if (onValueSelected) {
            onValueSelected(item.key)
          }
          this.blurInput()
        }}
        // If an invalid value has been typed into the input, set it back to the currently slected item.
        onInputValueChange={(inputValue, stateAndHelpers) => {
          if (inputValue && inputValue !== itemToString(stateAndHelpers.selectedItem)) {
            fieldApi.setValue(itemToString(stateAndHelpers.selectedItem))
          }
        }}
        initialInputValue={initialInputValue}
        initialSelectedItem={initialSelectedItem}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          highlightedIndex,
          selectedItem,
          closeMenu,
          openMenu,
          toggleMenu
        }) => (
          <div style={{ position: 'relative' }}>
            <Flex alignItems="center">
              <StyledInput
                placeholder="Please select"
                {...rest}
                {...getInputProps({
                  onBlur: closeMenu,
                  onFocus: openMenu,
                  onMouseDown: toggleMenu
                })}
                initialValue={selectedItem ? selectedItem.value : null}
                forwardedRef={this.inputRef}
              />
              <Box>
                {isOpen ? <ArrowIconOpen width={iconSize} /> : <ArrowIconClosed width={iconSize} />}
              </Box>
            </Flex>
            {isOpen && (
              <SelectOptionList {...getMenuProps({}, { suppressRefError: true })}>
                {this.renderSelectOptions(highlightedIndex, selectedItem, getItemProps)}
              </SelectOptionList>
            )}
          </div>
        )}
      </Downshift>
    )
  }
}

export default withTheme(asField(Select))
