import React from 'react'
import PropTypes from 'prop-types'
import { storiesOf } from '@storybook/react'
import { BackgroundPrimary, BackgroundTertiary, BackgroundSecondary, Page } from 'components/UI'
import { Content } from '../helpers'

const Wrapper = ({ children }) => (
  <Page css={{ height: '50px', 'min-height': '200px' }}>{children}</Page>
)
Wrapper.propTypes = {
  children: PropTypes.node,
}

storiesOf('Components', module).addWithChapters('Background', {
  chapters: [
    {
      sections: [
        {
          options: {
            decorator: story => <Wrapper>{story()}</Wrapper>,
          },
          sectionFn: () => (
            <BackgroundPrimary
              css={{
                height: '100%',
              }}
              width={1}
            >
              <Content>BackgroundPrimary</Content>
            </BackgroundPrimary>
          ),
        },
        {
          options: {
            decorator: story => <Wrapper>{story()}</Wrapper>,
          },
          sectionFn: () => (
            <BackgroundSecondary
              css={{
                height: '100%',
              }}
              width={1}
            >
              <Content>BackgroundSecondary</Content>
            </BackgroundSecondary>
          ),
        },
        {
          options: {
            decorator: story => <Wrapper>{story()}</Wrapper>,
          },
          sectionFn: () => (
            <BackgroundTertiary
              css={{
                height: '100%',
              }}
              width={1}
            >
              <Content>BackgroundTertiary</Content>
            </BackgroundTertiary>
          ),
        },
      ],
    },
  ],
})
