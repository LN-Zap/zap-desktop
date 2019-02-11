import React from 'react'
import PropTypes from 'prop-types'
import { storiesOf } from '@storybook/react'
import { Page, Panel } from 'components/UI'
import { Content } from '../helpers'

const Wrapper = ({ children }) => (
  <Page css={{ height: '500px', 'min-height': '500px' }}>{children}</Page>
)
Wrapper.propTypes = {
  children: PropTypes.node
}

storiesOf('Layouts', module).addWithChapters('Panel', {
  subtitle: 'For pages with a fixed header and footer.',
  info: `Header and footer regions will always stick to the top and bottom of a panels container.`,
  chapters: [
    {
      sections: [
        {
          sectionFn: () => (
            <Wrapper>
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
            </Wrapper>
          )
        }
      ]
    }
  ]
})
