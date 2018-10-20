import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Menu, MenuItem, MenuItemGroup } from 'components/UI'

storiesOf('Components.Menu', module).add('Menu', () => (
  <Menu onSelect={action('select')}>
    <MenuItemGroup title="My Items">
      <MenuItem key="item1">My item 1</MenuItem>
      <MenuItem key="item2">My item 2</MenuItem>
      <MenuItem key="item3">My item 3</MenuItem>
    </MenuItemGroup>

    <MenuItemGroup title="Other items">
      <MenuItem key="item4">Other item 1</MenuItem>
      <MenuItem key="item5">Other item 2</MenuItem>
      <MenuItem key="item6">Other item 3</MenuItem>
    </MenuItemGroup>
  </Menu>
))
