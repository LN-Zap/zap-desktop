import React from 'react'

import { storiesOf } from '@storybook/react'

import { Panel } from 'components/UI'

import { Window, Content } from '../helpers'

storiesOf('Layouts', module).addWithChapters('Panel', {
  subtitle: 'For pages with a fixed header and footer.',
  info: `Header and footer regions will always stick to the top and bottom of a panels container.`,
  chapters: [
    {
      sections: [
        {
          sectionFn: () => (
            <Window>
              <Panel width={1}>
                <Panel.Header bg="green">
                  <Content>Panel Header</Content>
                </Panel.Header>
                <Panel.Body bg="blue">
                  <Content>Panel Body</Content>
                </Panel.Body>
                <Panel.Footer bg="green">
                  <Content>Panel Footer</Content>
                </Panel.Footer>
              </Panel>
            </Window>
          ),
        },
      ],
    },
  ],
})
