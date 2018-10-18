import React from 'react'
import { MenuItem as MenuItemBase } from 'rc-menu'
import system from '@rebass/components'
import styled from 'styled-components'

const SystemMenuItem = system(
  {
    extend: MenuItemBase,
    py: 2
  },
  'space'
)

const StyledMenuItem = styled(SystemMenuItem)`
  list-style-type: none;
  &.rc-menu-item-active {
    color: ${props => props.theme.colors.lightningOrange};
    cursor: pointer;
  }
  &.rc-menu-item-selected {
    color: ${props => props.theme.colors.lightningOrange};
  }
`

/**
 * @render react
 * @name MenuItem
 * @example
 * <MenuItem>MenuItem item 1</MenuItem>
 */
const MenuItem = props => <StyledMenuItem {...props} />

export default MenuItem
