import React from 'react'
import PropTypes from 'prop-types'
import { storiesOf } from '@storybook/react'
import { ThemeProvider, withTheme } from 'styled-components'
import { Box, Card, Flex } from 'rebass'
import { BackgroundDark, Text } from 'components/UI'
import { dark, light } from 'themes'
import { Column, Group, Element } from './helpers'

const Swatch = ({ name, color }) => (
  <Element>
    <Flex mb={2}>
      <Card
        bg={color}
        width={50}
        css={{ height: '50px' }}
        mr={21}
        borderRadius={8}
        borderColor="primaryText"
        border="solid 1px"
      />
      <Box>
        <Text fontWeight="normal">{name}</Text>
        <Text>{color}</Text>
      </Box>
    </Flex>
  </Element>
)
Swatch.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string
}

const Palette = withTheme(({ theme, ...rest }) => (
  <Box {...rest}>
    {Object.keys(theme.palette).map(key => (
      <Swatch key={key} name={key} color={theme.palette[key]} />
    ))}
  </Box>
))

storiesOf('Welcome', module).addWithChapters('Color palette', {
  subtitle: 'Colors that we use throughout the app.',
  info: `This page shows our two primary colour palettes. These are used as "themes" that users can switch between
  within the app.`,
  chapters: [
    {
      sections: [
        {
          options: {
            showSource: false,
            allowSourceToggling: false,
            showPropTables: false,
            allowPropTablesToggling: false
          },
          sectionFn: () => (
            <Flex>
              <Column>
                <Group title="Dark">
                  <ThemeProvider theme={dark}>
                    <BackgroundDark p={3}>
                      <Palette />
                    </BackgroundDark>
                  </ThemeProvider>
                </Group>
              </Column>

              <Column>
                <Group title="Light">
                  <ThemeProvider theme={light}>
                    <BackgroundDark p={3}>
                      <Palette />
                    </BackgroundDark>
                  </ThemeProvider>
                </Group>
              </Column>
            </Flex>
          )
        }
      ]
    }
  ]
})
