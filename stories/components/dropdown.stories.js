import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Dropdown } from 'components/UI'

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
      ],
    },
  ],
})
