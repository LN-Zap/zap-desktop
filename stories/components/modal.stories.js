import React from 'react'

import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { Modal, Page, Text } from 'components/UI'

storiesOf('Components', module).addWithChapters('Modal', {
  subtitle: 'For displaying content in an overlay.',
  info: `We use modals to display popup screens on top of your current position in the app. Closing the modal should
  take you back to where you were before you opened it.`,
  chapters: [
    {
      sections: [
        {
          sectionFn: () => {
            const hasLogo = boolean('With header', false)
            return (
              <Page>
                <Modal hasLogo={hasLogo} onClose={action('clicked')}>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </Text>
                </Modal>
              </Page>
            )
          },
        },
      ],
    },
  ],
})
