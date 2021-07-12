import React, { useState } from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import Settings from 'components/Icon/Settings'
import { Dropdown, Button } from 'components/UI'

// eslint-disable-next-line react/prop-types
const IconDropdownButton = ({ onToggle }) => {
  return (
    <Button onClick={onToggle} size="small" variant="secondary">
      <Settings height="16px" width="16px" />
    </Button>
  )
}
// To create multiselect dropdown set `isMultiselect` to true and
// Provide a custom `buttonComponent`. The latter is not required, but in multiselect
// mode dropdown selected text value will show all values concatenated which is not pretty.
const MultiselectDropdown = () => {
  const [activeItems, setActiveItems] = useState(new Set(['usd']))
  const items = [
    {
      key: 'usd',
      value: 'USD',
    },
    {
      key: 'eur',
      value: 'EUR',
    },
    {
      key: 'gbp',
      value: 'GBP',
    },
  ]
  const onChange = value => {
    const updated = new Set([...activeItems])
    if (updated.has(value)) {
      updated.delete(value)
    } else {
      updated.add(value)
    }
    setActiveItems(updated)
  }

  return (
    <Dropdown
      activeKey={activeItems}
      buttonComponent={IconDropdownButton}
      isMultiselect
      items={items}
      justify="left"
      onChange={onChange}
    />
  )
}

storiesOf('Components', module).addWithChapters('Dropdown', {
  chapters: [
    {
      sections: [
        {
          title: 'Left justify (default)',
          sectionFn: () => {
            const activeKey = 'btc'
            const items = [
              {
                key: 'btc',
                value: 'BTC',
              },
              {
                key: 'bits',
                value: 'bits',
              },
              {
                key: 'sats',
                value: 'satoshis',
              },
            ]
            return <Dropdown activeKey={activeKey} items={items} onChange={action('onChange')} />
          },
        },
        {
          title: 'Right justify',
          sectionFn: () => {
            const activeKey = 'usd'
            const items = [
              {
                key: 'usd',
                value: 'USD',
              },
              {
                key: 'eur',
                value: 'EUR',
              },
              {
                key: 'gbp',
                value: 'GBP',
              },
            ]
            return (
              <Dropdown
                activeKey={activeKey}
                items={items}
                justify="right"
                onChange={action('onChange')}
              />
            )
          },
        },
        {
          title: 'Multiselect',
          sectionFn: () => {
            return <MultiselectDropdown />
          },
        },
      ],
    },
  ],
})
