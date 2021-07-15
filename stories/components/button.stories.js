import React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Flex, Box } from 'rebass/styled-components'

import ArrowLeft from 'components/Icon/ArrowLeft'
import ArrowRight from 'components/Icon/ArrowRight'
import Padlock from 'components/Icon/Padlock'
import { Button } from 'components/UI'

storiesOf('Components', module).addWithChapters('Button', {
  subtitle: 'Buttons for forms and anything else that the user might want to click on.',
  chapters: [
    {
      sections: [
        {
          title: 'Basic',
          sectionFn: () => <Button onClick={action('clicked')}>Basic button</Button>,
        },
        {
          title: 'With Icon',
          sectionFn: () => (
            <section>
              <Button onClick={action('clicked')}>
                <Flex alignItems="center">
                  <Box>
                    <ArrowLeft />
                  </Box>
                  <Box ml={1}>Back</Box>
                </Flex>
              </Button>{' '}
              <Button onClick={action('clicked')}>
                <Flex alignItems="center">
                  <Box mr={1}>Next</Box>
                  <Box>
                    <ArrowRight />
                  </Box>
                </Flex>
              </Button>
            </section>
          ),
        },
      ],
    },
    {
      title: 'Variants',
      sections: [
        {
          title: 'Primary',
          sectionFn: () => (
            <Button onClick={action('clicked')} variant="primary">
              Primary button
            </Button>
          ),
        },
        {
          title: 'Secondary',
          sectionFn: () => (
            <Button onClick={action('clicked')} variant="secondary">
              Secondary button
            </Button>
          ),
        },
        {
          title: 'Danger',
          sectionFn: () => (
            <Button onClick={action('clicked')} variant="danger">
              A very dangerous button
            </Button>
          ),
        },
      ],
    },
    {
      title: 'States',
      sections: [
        {
          title: 'Processing',
          sectionFn: () => (
            <Button isProcessing onClick={action('clicked')}>
              Processing
            </Button>
          ),
        },
        {
          title: 'With an icon',
          sectionFn: () => (
            <Button icon={Padlock} onClick={action('clicked')}>
              Locked
            </Button>
          ),
        },
        {
          title: 'Disabled',
          sectionFn: () => (
            <Button isDisabled onClick={action('clicked')}>
              Disabled button
            </Button>
          ),
        },
      ],
    },
    {
      title: 'Sizes',
      sections: [
        {
          title: 'Medium',
          sectionFn: () => <Button onClick={action('clicked')}>Medium button</Button>,
        },
        {
          title: 'Small',
          sectionFn: () => (
            <Button onClick={action('clicked')} size="small">
              Small button
            </Button>
          ),
        },
      ],
    },
  ],
})
