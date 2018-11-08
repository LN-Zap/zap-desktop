import React from 'react'
import PropTypes from 'prop-types'
import { storiesOf } from '@storybook/react'
import { BackgroundPrimary, BackgroundTertiary, BackgroundSecondary, Page } from 'components/UI'
import { Content } from '../helpers'

const Wrapper = ({ children }) => (
  <Page css={{ height: '50px', 'min-height': '200px' }}>{children}</Page>
)
Wrapper.propTypes = {
  children: PropTypes.node
}

storiesOf('Components', module).addWithChapters('Background', {
  chapters: [
    {
      sections: [
        {
          options: {
            decorator: story => <Wrapper>{story()}</Wrapper>
          },
          sectionFn: () => (
            <BackgroundPrimary
              width={1}
              css={{
                height: '100%'
              }}
            >
              <Content>BackgroundPrimary</Content>
            </BackgroundPrimary>
          )
        },
        {
          options: {
            decorator: story => <Wrapper>{story()}</Wrapper>
          },
          sectionFn: () => (
            <BackgroundSecondary
              width={1}
              css={{
                height: '100%'
              }}
            >
              <Content>BackgroundSecondary</Content>
            </BackgroundSecondary>
          )
        },
        {
          options: {
            decorator: story => <Wrapper>{story()}</Wrapper>
          },
          sectionFn: () => (
            <BackgroundTertiary
              width={1}
              css={{
                height: '100%'
              }}
            >
              <Content>BackgroundTertiary</Content>
            </BackgroundTertiary>
          )
        }
      ]
    }
  ]
})
