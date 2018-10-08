import React from 'react'
import system from '@rebass/components'
import styled from 'styled-components'
import MenuBase from 'rc-menu'

const SystemMenu = system(
  {
    extend: MenuBase,
    mb: 2,
    p: 0
  },
  'space'
)

const StyledMenu = styled(SystemMenu)`
  outline: none;
`

/**
 * @render react
 * @name Menu
 * @example
 * <Menu>
     <MenuItem>Menu item 1</MenuItem>
     <MenuItem>Menu item 2</MenuItem>
   </Menu>
 */
const Menu = props => <StyledMenu {...props} />

export default Menu
