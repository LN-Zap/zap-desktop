import React from 'react'

import { storiesOf } from '@storybook/react'
import PropTypes from 'prop-types'
import { Box, Card, Flex } from 'rebass/styled-components'
import { ThemeProvider, withTheme } from 'styled-components'

import { BackgroundPrimary, Text } from 'components/UI'
import { dark, light } from 'themes'

import { Column, Group, Element } from '../helpers'

const Swatch = ({ name, color }) => (
  <Element>
    <Flex mb={2}>
      <Card
        bg={color}
        mr={21}
        size={50}
        sx={{
          boxShadow: 's',
          borderRadius: 'm',
        }}
      />
      <Box>
        <Text fontWeight="normal">{name}</Text>
        <Text>{color}</Text>
      </Box>
    </Flex>
  </Element>
)
Swatch.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
}

const Palette = withTheme(({ theme, ...rest }) => (
  <Box {...rest}>
    {Object.keys(theme.colors).map(key => (
      <Swatch color={theme.colors[key]} key={key} name={key} />
    ))}
  </Box>
))

storiesOf('General', module).addWithChapters('Color palette', {
  subtitle: 'Colors that we use throughout the app.',
  info: `This page shows our two primary color palettes. These are used as "themes" that users can switch between
  within the app.`,
  chapters: [
    {
      sections: [
        {
          options: {
            showSource: false,
            allowSourceToggling: false,
            showPropTables: false,
            allowPropTablesToggling: false,
          },
          sectionFn: () => (
            <Flex>
              <Column>
                <Group hasBar={false} title="Dark">
                  <ThemeProvider theme={dark}>
                    <BackgroundPrimary p={3}>
                      <Palette />
                    </BackgroundPrimary>
                  </ThemeProvider>
                </Group>
              </Column>

              <Column>
                <Group hasBar={false} title="Light">
                  <ThemeProvider theme={light}>
                    <BackgroundPrimary p={3}>
                      <Palette />
                    </BackgroundPrimary>
                  </ThemeProvider>
                </Group>
              </Column>
            </Flex>
          ),
        },
      ],
    },
  ],
})
