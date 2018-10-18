import React from 'react'
import system from '@rebass/components'
import styled from 'styled-components'
import { MenuItemGroup as MenuItemGroupBase } from 'rc-menu'

const SystemMenuItemGroup = system(
  {
    extend: MenuItemGroupBase,
    mb: 3
  },
  'space'
)

const StyledMenuItemGroup = styled(SystemMenuItemGroup)`
  list-style-type: none;
  > .rc-menu-item-group-title {
    font-weight: bold;
    padding: ${props => props.theme.space[2]}px 0;
  }
  > .rc-menu-item-group-list {
    padding: 0;
  }
`

/**
 * @render react
 * @name MenuItemGroup
 * @example
 * <MenuItem>MenuItem item 1</MenuItem>
 */
const MenuItemGroup = props => <StyledMenuItemGroup {...props} />

export default MenuItemGroup
