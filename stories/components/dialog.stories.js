/* eslint-disable no-alert */
import React from 'react'

import { storiesOf } from '@storybook/react'
import { Flex } from 'rebass/styled-components'

import Eye from 'components/Icon/Eye'
import { Dialog, Text, Heading, Countdown, Button, Page } from 'components/UI'

storiesOf('Components', module)
  .addDecorator(story => (
    <Page bg="secondaryColor" pl={4}>
      {story()}
    </Page>
  ))
  .addWithChapters('Dialog', {
    subtitle: 'For showing prompts and messages',
    chapters: [
      {
        sections: [
          {
            title: 'Two buttons',
            sectionFn: () => (
              <Dialog
                buttons={[
                  { name: 'Delete', onClick: () => alert('Delete') },
                  { name: 'Cancel', onClick: () => alert('Cancel') },
                ]}
                header={`Are you sure you want to delete "MyWallet" ?`}
                onClose={() => alert('closed')}
              />
            ),
          },
          {
            title: 'Message box mode',
            sectionFn: () => (
              <Dialog
                buttons={[{ name: 'Ok', onClick: () => alert('Ok') }]}
                header="Your wallet has been removed"
                onClose={() => alert('closed')}
              />
            ),
          },
          {
            title: 'Custom dialog',
            sectionFn: () => {
              const date = new Date(Date.now() + 60000)
              const customHeader = (
                <Flex alignItems="center" alignSelf="stretch" flexDirection="column" mb={3}>
                  <Eye color="white" height={64} width={64} />
                  <Heading.H2>Custom heading</Heading.H2>
                </Flex>
              )

              const customButtons = (
                <>
                  <Button key="0" variant="primary">
                    Primary
                  </Button>
                  <Button key="1" variant="secondary">
                    Secondary
                  </Button>
                </>
              )

              return (
                <Dialog
                  buttons={customButtons}
                  header={customHeader}
                  onClose={() => alert('closed')}
                >
                  <Flex alignItems="center" flexDirection="column">
                    <Text fontSize="xl">This is a custom body</Text>
                    <Countdown date={date} />
                  </Flex>
                </Dialog>
              )
            },
          },
        ],
      },
    ],
  })
