import React from 'react'
import { storiesOf } from '@storybook/react'
import { State, Store } from '@sambego/storybook-state'
import { Tabs } from 'components/UI'

const store = new Store({
  activeKey: 'all',
})

const dispatchProps = {
  onClick: activeKey => store.set({ activeKey }),
}
storiesOf('Components', module).addWithChapters('Tabs', {
  subtitle: 'List of buttons formatted as tabs',
  chapters: [
    {
      sections: [
        {
          sectionFn: () => (
            <State store={store}>
              {state => (
                <Tabs
                  {...state}
                  {...dispatchProps}
                  items={[
                    { key: 'all', name: 'All' },
                    { key: 'sent', name: 'Send' },
                    { key: 'received', name: 'Received' },
                    { key: 'pending', name: 'Pending' },
                  ]}
                />
              )}
            </State>
          ),
        },
      ],
    },
  ],
})
