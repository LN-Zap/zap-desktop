import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import { compose } from 'redux'
import { injectIntl, intlShape } from 'react-intl'
import styled, { withTheme } from 'styled-components'
import Downshift from 'downshift'
import { Box, Flex } from 'rebass'
import system from '@rebass/components'
import { useIntl } from 'hooks'
import Check from 'components/Icon/Check'
import AngleUp from 'components/Icon/AngleUp'
import AngleDown from 'components/Icon/AngleDown'
import Text from './Text'
import { BasicInput } from './Input'
import messages from './messages'

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
      p: 2,
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

const StyledInput = styled(BasicInput)`
  input {
    cursor: pointer;
    color: transparent;
    text-shadow: 0 0 0 ${props => props.color || props.theme.colors.primaryText};
  }
`

const itemToString = item => (item ? item.value : '')

const getInitialSelectedItem = (items, initialSelectedItem) => {
  return initialSelectedItem
    ? {
        initialInputValue: itemToString(initialSelectedItem),
        initialSelectedItem: items.find(i => i.key === initialSelectedItem),
      }
    : {}
}

const Select = props => {
  const { intl, messageMapper } = props
  const inputRef = useRef(null)
  // eslint-disable-next-line react/destructuring-assignment
  const items = useIntl(props.items, messageMapper, intl)
  const blurInput = () => inputRef.current && inputRef.current.blur()

  const renderSelectOptions = (highlightedIndex, selectedItem, getItemProps) => {
    const { theme } = props

    return items.map((item, index) => (
      <SelectOptionItem
        key={item.key}
        {...getItemProps({
          key: item.key,
          index,
          item,
        })}
        bg={highlightedIndex === index ? theme.colors.primaryColor : null}
        p={2}
      >
        <Flex alignItems="center" pr={2}>
          <Text color="superGreen" textAlign="center" width="20px">
            {selectedItem && selectedItem.key === item.key && <Check height="0.95em" />}
          </Text>
          <Text>{item.value}</Text>
        </Flex>
      </SelectOptionItem>
    ))
  }

  const {
    fieldApi,
    fieldState,
    iconSize,
    theme,
    color,
    onValueSelected,
    initialSelectedItem: initialSelectedItemOriginal,
    ...rest
  } = props
  const { setValue, setTouched } = fieldApi

  const { initialInputValue, initialSelectedItem } = getInitialSelectedItem(
    items,
    initialSelectedItemOriginal || fieldState.value
  )

  return (
    <Downshift
      initialInputValue={initialInputValue}
      initialSelectedItem={initialSelectedItem}
      itemToString={itemToString}
      // When an item is selected, set the item in the Informed form state.
      onInputValueChange={(inputValue, stateAndHelpers) => {
        if (inputValue && inputValue !== itemToString(stateAndHelpers.selectedItem)) {
          fieldApi.setValue(itemToString(stateAndHelpers.selectedItem))
        }
      }}
      onSelect={item => {
        if (!item) {
          return
        }
        setValue(item.key)
        setTouched(true)
        if (onValueSelected) {
          onValueSelected(item.key)
        }
        blurInput()
      }}
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
        toggleMenu,
      }) => {
        const getInitialValue = () => {
          if (selectedItem) {
            return selectedItem.value
          }

          if (initialSelectedItem) {
            initialSelectedItem.value
          }

          return ''
        }

        return (
          <div style={{ position: 'relative' }}>
            <Flex alignItems="center">
              <StyledInput
                placeholder={intl.formatMessage({ ...messages.select_placeholder })}
                {...rest}
                initialValue={getInitialValue()}
                {...getInputProps({
                  onBlur: closeMenu,
                  onFocus: openMenu,
                  onMouseDown: toggleMenu,
                })}
                fieldApi={fieldApi}
                fieldState={fieldState}
                forwardedRef={inputRef}
              />
              <Box>
                {isOpen ? <ArrowIconOpen width={iconSize} /> : <ArrowIconClosed width={iconSize} />}
              </Box>
            </Flex>
            {isOpen && (
              <SelectOptionList {...getMenuProps({}, { suppressRefError: true })}>
                {renderSelectOptions(highlightedIndex, selectedItem, getItemProps)}
              </SelectOptionList>
            )}
          </div>
        )
      }}
    </Downshift>
  )
}

Select.propTypes = {
  color: PropTypes.string,
  fieldApi: PropTypes.object.isRequired,
  fieldState: PropTypes.object.isRequired,
  iconSize: PropTypes.number,
  initialSelectedItem: PropTypes.string,
  intl: intlShape.isRequired,
  items: PropTypes.array,
  messageMapper: PropTypes.func,
  onValueSelected: PropTypes.func,
  theme: PropTypes.object.isRequired,
}

Select.defaultProps = {
  items: [],
  iconSize: 8,
}

const BasicSelect = compose(
  injectIntl,
  withTheme
)(Select)

export { BasicSelect }

const BasicSelectAsField = asField(BasicSelect)

// Wrap the select field to make use of parse and format to display items using their mapped values.
// This enables us to set the input value as the key, whilst displaying the mapped valued.
const WrappedSelect = props => {
  const { intl, items, messageMapper } = props
  const mappedItems = useIntl(items, messageMapper, intl)

  /**
   * format - Format item by mapping key to value.
   *
   * @param {string} value Value to format
   * @returns {string} Mapped value
   */
  const format = value => {
    if (value == null) {
      return value
    }
    const item = mappedItems.find(item => item.key === value)
    return item ? item.value : value
  }

  /**
   * parse - Parse item by mapping key to key.
   *
   * @param {string} value Value to format
   * @returns {string} Mapped value
   */
  const parse = value => {
    if (value == null) {
      return value
    }
    const item = items.find(item => item.key === value)
    return item ? item.key : value
  }

  return <BasicSelectAsField format={format} parse={parse} {...props} />
}

WrappedSelect.propTypes = {
  intl: intlShape.isRequired,
  items: PropTypes.array,
  messageMapper: PropTypes.func,
}
export default injectIntl(WrappedSelect)
