import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Button } from 'components/UI'
import SystemNavPrevious from 'components/Icon/SystemNavPrevious'
import SystemNavNext from 'components/Icon/SystemNavNext'

storiesOf('Components', module).addWithChapters('Button', {
  subtitle: 'Buttons for forms and anything else that the user might want to click on.',
  chapters: [
    {
      sections: [
        {
          title: 'Basic',
          sectionFn: () => <Button onClick={action('clicked')}>Basic button</Button>
        },
        {
          title: 'With Icon',
          sectionFn: () => (
            <section>
              <Button onClick={action('clicked')}>
                <SystemNavPrevious />
                Previous
              </Button>{' '}
              <Button onClick={action('clicked')}>
                Next
                <SystemNavNext />
              </Button>
            </section>
          )
        }
      ]
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
          )
        },
        {
          title: 'Secondary',
          sectionFn: () => (
            <Button onClick={action('clicked')} variant="secondary">
              Secondary button
            </Button>
          )
        }
      ]
    },
    {
      title: 'States',
      sections: [
        {
          title: 'Processing',
          sectionFn: () => (
            <Button processing onClick={action('clicked')}>
              Processing
            </Button>
          )
        },
        {
          title: 'Disabled',
          sectionFn: () => (
            <Button disabled onClick={action('clicked')}>
              Disabled button
            </Button>
          )
        }
      ]
    },
    {
      title: 'Sizes',
      sections: [
        {
          title: 'Medium',
          sectionFn: () => <Button onClick={action('clicked')}>Medium button</Button>
        },
        {
          title: 'Small',
          sectionFn: () => (
            <Button onClick={action('clicked')} size="small">
              Small button
            </Button>
          )
        }
      ]
    }
  ]
})
