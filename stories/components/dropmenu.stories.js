import React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Box, Flex } from 'rebass/styled-components'

import Padlock from 'components/Icon/Padlock'
import Search from 'components/Icon/Search'
import Settings from 'components/Icon/Settings'
import User from 'components/Icon/User'
import { Dropmenu, Text } from 'components/UI'

const items = [
  {
    type: 'content',
    id: 'content-item',
    content: (
      <Box>
        <Text fontSize="s">Any old content...</Text>
        <Text fontSize="m" textAlign="center">
          ...can go in a `content` item.
        </Text>
        <Text fontSize="l" textAlign="right">
          Use your imagination!
        </Text>
      </Box>
    ),
  },
  { id: 'bar1', type: 'bar' },
  { id: 'basic', title: 'Basic', onClick: action('basic') },
  {
    id: 'basicwithicon',
    title: 'Basic with icon',
    onClick: action('basicwithicon'),
    icon: <Search />,
  },
  { id: 'bar2', type: 'bar' },
  {
    id: 'item1',
    title: 'Item 1',
    description: 'Item with description',
    onClick: action('item1'),
  },
  {
    id: 'item2',
    title: 'Item 2',
    description: 'Item with icon & description',
    icon: <Padlock />,
    onClick: action('item2'),
  },
  { id: 'bar3', type: 'bar' },
  {
    id: 'parent1',
    title: 'Item with submenu',
    submenu: [
      { id: 'child1', title: 'Child item 1' },
      { id: 'child2', title: 'Child item 2' },
    ],
  },
  {
    id: 'parent2',
    title: 'Item with icon & submenu',
    icon: <Settings />,
    submenu: Array.from(Array(30).keys()).map(index => ({
      id: `child1.${index}`,
      title: `Child item ${index}`,
    })),
  },
  {
    id: 'nested',
    title: 'Nested submenus',
    icon: <User />,
    submenu: [
      {
        id: 'nested1',
        title: 'Nested item 1',
        submenu: [
          { id: 'nested1.1', title: 'Nested item 1.1' },
          { id: 'nested1.2', title: 'Nested item 1.2' },
        ],
      },
      { id: 'nested2', title: 'Nested item 2' },
    ],
  },
]

storiesOf('Components', module).addWithChapters('Dropmenu', {
  chapters: [
    {
      sections: [
        {
          title: 'Left justify (default)',
          sectionFn: () => {
            return <Dropmenu items={items}>Menu</Dropmenu>
          },
        },
        {
          title: 'Right justify',
          sectionFn: () => {
            return (
              <Flex alignItems="flex-end" flexDirection="column" width={0.5}>
                <Dropmenu items={items} justify="right">
                  Menu
                </Dropmenu>
              </Flex>
            )
          },
        },
      ],
    },
  ],
})
