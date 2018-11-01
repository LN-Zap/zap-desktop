import React from 'react'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import { Input } from 'components/UI'
import styled, { withTheme } from 'styled-components'
import Downshift from 'downshift'
import { Box } from 'rebass'
import system from '@rebass/components'

const SelectOptionList = styled.ul`
  padding: 0;
  margin-top: 0;
  position: absolute;
  z-index: 2;
  width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  border: ${props => (props.isOpen ? null : 'none')};
  background-color: ${props => props.theme.colors.lightestBackground};
`

const SelectOptionItem = styled(
  system(
    {
      extend: Box,
      as: 'li',
      p: 3,
      backgroundColor: 'lightestBackground'
    },
    'space',
    'color'
  )
)`
  outline: none;
  cursor: pointer;
`

const ControllerButton = styled('button')({
  backgroundColor: 'transparent',
  border: 'none',
  position: 'absolute',
  right: '5px',
  top: 0,
  cursor: 'pointer',
  width: '47px',
  display: 'flex',
  flexDirection: 'column',
  height: '50px',
  justifyContent: 'center',
  alignItems: 'center',
  outline: 'none'
})

const ArrowIcon = ({ isOpen }) => (
  <svg
    viewBox="0 0 20 20"
    preserveAspectRatio="none"
    width={16}
    fill="transparent"
    stroke="#979797"
    strokeWidth="1.1px"
    transform={isOpen ? 'rotate(180)' : null}
  >
    <path d="M1,6 L10,15 L19,6" />
  </svg>
)
ArrowIcon.propTypes = {
  isOpen: PropTypes.bool
}

const itemToString = item => (item ? item.value : '')

/**
 * @render react
 * @name Select
 */
class Select extends React.PureComponent {
  static displayName = 'Select'

  static defaultProps = {
    items: []
  }

  render() {
    const { fieldApi, items, theme, ...rest } = this.props
    return (
      <Downshift
        itemToString={itemToString}
        // When an item is selected, set the item in the Informed form state.
        onSelect={item => fieldApi.setValue(item.value)}
        // If an invalid value has been typed into the input, set it back to the currently slected item.
        onInputValueChange={(inputValue, stateAndHelpers) => {
          if (inputValue && inputValue !== itemToString(stateAndHelpers.selectedItem)) {
            fieldApi.setValue(itemToString(stateAndHelpers.selectedItem))
          }
        }}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          getToggleButtonProps,
          isOpen,
          highlightedIndex,
          selectedItem,
          openMenu,
          closeMenu,
          toggleMenu
        }) => (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <ControllerButton {...getToggleButtonProps()}>
                <ArrowIcon isOpen={isOpen} />
              </ControllerButton>
              <Input
                placeholder="Please select"
                {...rest}
                {...getInputProps({
                  onBlur: closeMenu,
                  onFocus: openMenu,
                  onMouseDown: toggleMenu
                })}
              />
            </div>
            <SelectOptionList {...getMenuProps()}>
              {isOpen
                ? items.map((item, index) => (
                    <SelectOptionItem
                      key=""
                      {...getItemProps({
                        key: item.value,
                        index,
                        item
                      })}
                      style={{
                        backgroundColor:
                          highlightedIndex === index ? theme.colors.lightningOrange : null,
                        fontWeight: selectedItem === item ? 'bold' : 'normal'
                      }}
                    >
                      {item.label || item.value}
                    </SelectOptionItem>
                  ))
                : null}
            </SelectOptionList>
          </div>
        )}
      </Downshift>
    )
  }
}

export default withTheme(asField(Select))
