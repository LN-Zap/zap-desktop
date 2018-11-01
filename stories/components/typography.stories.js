import React from 'react'
import { storiesOf } from '@storybook/react'
import { Heading, Text } from 'components/UI'

storiesOf('Components.Typography', module)
  .add('heading', () => (
    <React.Fragment>
      <Heading>This is a default heading (h2)</Heading>
      <Heading.h1>This is an h1</Heading.h1>
      <Heading.h2>This is an h2</Heading.h2>
      <Heading.h3>This is an h3</Heading.h3>
      <Heading.h4>This is an h4</Heading.h4>
      <Heading.h5>This is an h5</Heading.h5>
      <Heading.h6>This is an h6</Heading.h6>
    </React.Fragment>
  ))
  .add('text', () => (
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Text>
  ))
