import React from 'react'

import { storiesOf } from '@storybook/react'
import { Flex } from 'rebass/styled-components'

import { Card, Text, Button, Heading } from 'components/UI'

storiesOf('Components', module).addWithChapters('Card', {
  subtitle: 'For displaying grouped information.',
  info: `The Card component is used to display grouped information.`,
  chapters: [
    {
      sections: [
        {
          sectionFn: () => (
            <Card width={0.5}>
              <Heading.H1 mb={2}>This is a Card</Heading.H1>
              <Text mb={2}>
                A card is just a basic Box with some style applied. It has rounded corners, a
                drop-shadow, and displays with the primary background color.
              </Text>
              <Text mb={2}>
                It is a wrapper around @rebass Card and all of the default styles can be overridden
                using the standard rebass style props.
              </Text>
              <Flex pt={3}>
                <Button ml="auto" size="small">
                  More info
                </Button>
              </Flex>
            </Card>
          ),
        },
      ],
    },
  ],
})
