import React from 'react'
import renderer from 'react-test-renderer'
import { dark } from 'themes'
import { ThemeProvider } from 'styled-components'
import { Menu, MenuItem, MenuItemGroup } from 'components/UI'

describe('component.UI.Menu', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={dark}>
          <Menu>
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
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
