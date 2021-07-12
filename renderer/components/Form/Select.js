import React, { useRef } from 'react'

import { themeGet } from '@styled-system/theme-get'
import Downshift from 'downshift'
import { asField } from 'informed'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import { compose } from 'redux'
import styled, { withTheme } from 'styled-components'

import { intlShape } from '@zap/i18n'
import AngleDown from 'components/Icon/AngleDown'
import AngleUp from 'components/Icon/AngleUp'
import Check from 'components/Icon/Check'
import { Text } from 'components/UI'
import { useIntlMap, useMaxScreenHeight } from 'hooks'

import { BasicInput } from './Input'
import Label from './Label'
import messages from './messages'

const SelectOptionList = styled.ul`
  padding: 0;
  margin-top: 4px;
  position: absolute;
  z-index: 2;
  width: 100%;
  max-height: ${props => props.maxHeight}px;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  background-color: ${themeGet('colors.secondaryColor')};
  border-radius: 5px;
  box-shadow: ${themeGet('shadows.s')};
`

const SelectOptionItem = props => (
  <Box
    {...props}
    as="li"
    sx={{
      p: 2,
      outline: 'none',
      cursor: 'pointer',
    }}
  />
)

const getIconStyles = props => `
  margin-left: -${props.width + 16}px;
  width: ${props.width}px;
  pointer-events: none;
  color: ${themeGet('colors.gray')(props)};
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
    text-shadow: 0 0 0 ${props => themeGet('colors.primaryText')(props)};
  }
`

const itemToString = item => (item ? item.value : '')

const getSelectedItem = (items, key) => {
  return key
    ? {
        inputValue: itemToString(key),
        selectedItem: items.find(i => i.key === key),
      }
    : {}
}
const SelectOptionListContainer = props => {
  const { highlightedIndex, selectedItem, getItemProps, getMenuProps, renderSelectOptions } = props
  const [measuredRef, maxHeight] = useMaxScreenHeight(300)
  const height = maxHeight < 150 ? undefined : maxHeight
  return (
    <SelectOptionList
      {...getMenuProps({}, { suppressRefError: true })}
      maxHeight={height}
      ref={measuredRef}
    >
      {renderSelectOptions(highlightedIndex, selectedItem, getItemProps)}
    </SelectOptionList>
  )
}

SelectOptionListContainer.propTypes = {
  getItemProps: PropTypes.func.isRequired,
  getMenuProps: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number,
  renderSelectOptions: PropTypes.func.isRequired,
  selectedItem: PropTypes.object,
}

const Select = props => {
  const { intl, messageMapper } = props
  const inputRef = useRef(null)
  // eslint-disable-next-line react/destructuring-assignment
  const items = useIntlMap(props.items, messageMapper, intl)
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
    isRequired,
    label,
    field,
    tooltip,
    onValueSelected,
    initialSelectedItem: initialSelectedItemOriginal,
    ...rest
  } = props
  const { setValue, setTouched } = fieldApi

  const { inputValue, selectedItem: initialSelectedItem } = getSelectedItem(
    items,
    initialSelectedItemOriginal || fieldState.value
  )

  return (
    <Downshift
      initialInputValue={inputValue}
      initialSelectedItem={initialSelectedItem}
      itemToString={itemToString}
      onInputValueChange={(inputValue, stateAndHelpers) => {
        if (inputValue && inputValue !== itemToString(stateAndHelpers.selectedItem)) {
          fieldApi.setValue(itemToString(stateAndHelpers.selectedItem))
        }
      }}
      // When an item is selected, set the item in the Informed form state.
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
      selectedItem={getSelectedItem(items, fieldState.value).selectedItem}
    >
      {({
        getRootProps,
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
        /**
         * getInitialValue - Get the initial selected value.
         *
         * @returns {string} Initial selected value.
         */
        const getInitialValue = () => {
          if (selectedItem) {
            return selectedItem.value
          }
          if (initialSelectedItem) {
            return initialSelectedItem.value
          }
          return ''
        }

        /**
         * getValue - Get the current selected value.
         *
         * @returns {string} Current selected value.
         */
        const getValue = () => {
          return selectedItem ? selectedItem.value : ''
        }

        return (
          <Box sx={{ position: 'relative' }} {...getRootProps()}>
            {label && (
              <Label htmlFor={field} isRequired={isRequired} mb={2} tooltip={tooltip}>
                {label}
              </Label>
            )}
            <Flex alignItems="center">
              <StyledInput
                field={field}
                isRequired={isRequired}
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
                value={getValue()}
              />
              <Box>
                {isOpen ? <ArrowIconOpen width={iconSize} /> : <ArrowIconClosed width={iconSize} />}
              </Box>
            </Flex>
            {isOpen && (
              <SelectOptionListContainer
                {...{
                  getMenuProps,
                  renderSelectOptions,
                  highlightedIndex,
                  selectedItem,
                  getItemProps,
                }}
              />
            )}
          </Box>
        )
      }}
    </Downshift>
  )
}

Select.propTypes = {
  color: PropTypes.string,
  field: PropTypes.string.isRequired,
  fieldApi: PropTypes.object.isRequired,
  fieldState: PropTypes.object.isRequired,
  iconSize: PropTypes.number,
  initialSelectedItem: PropTypes.string,
  intl: intlShape.isRequired,
  isRequired: PropTypes.bool,
  items: PropTypes.array,
  label: PropTypes.string,
  messageMapper: PropTypes.func,
  onValueSelected: PropTypes.func,
  theme: PropTypes.object.isRequired,
  tooltip: PropTypes.string,
}

Select.defaultProps = {
  items: [],
  iconSize: 8,
}

const BasicSelect = compose(injectIntl, withTheme)(Select)

export { BasicSelect }

const BasicSelectAsField = asField(BasicSelect)

// Wrap the select field to make use of parse and format to display items using their mapped values.
// This enables us to set the input value as the key, whilst displaying the mapped valued.
const WrappedSelect = props => {
  const { intl, items, messageMapper } = props
  const mappedItems = useIntlMap(items, messageMapper, intl)

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
