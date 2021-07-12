import React from 'react'

import { storiesOf } from '@storybook/react'

import { Heading, Text } from 'components/UI'

storiesOf('General', module).addWithChapters('Typography', {
  subtitle: 'Text styles that we use throughout the app.',
  info: `This page shows the various fonts and font styles that we use. All text uses the "Roboto" font family.`,
  chapters: [
    {
      title: 'Heading',
      sections: [
        {
          title: 'h1',
          sectionFn: () => (
            <Heading.H1>
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Heading.H1>
          ),
        },
        {
          title: 'h2',
          sectionFn: () => (
            <Heading.H2>
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Heading.H2>
          ),
        },
        {
          title: 'h3',
          sectionFn: () => (
            <Heading.H3>
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Heading.H3>
          ),
        },
        {
          title: 'h4',
          sectionFn: () => (
            <Heading.H4>
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Heading.H4>
          ),
        },
      ],
    },
    {
      title: 'Text (weights)',
      sections: [
        {
          title: 'Normal',
          sectionFn: () => (
            <Text fontWeight="normal">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Text>
          ),
        },
        {
          title: 'Light',
          sectionFn: () => (
            <Text>
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Text>
          ),
        },
      ],
    },
    {
      title: 'Text (sizes)',
      sections: [
        {
          title: 'Extra Extra large',
          sectionFn: () => (
            <Text fontSize="xxl">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Text>
          ),
        },
        {
          title: 'Extra Large',
          sectionFn: () => (
            <Text fontSize="xl">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Text>
          ),
        },
        {
          title: 'Large',
          sectionFn: () => (
            <Text fontSize="l">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Text>
          ),
        },
        {
          title: 'Medium',
          sectionFn: () => (
            <Text fontSize="m">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Text>
          ),
        },
        {
          title: 'Small',
          sectionFn: () => (
            <Text fontSize="s">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Text>
          ),
        },
        {
          title: 'Extra Small',
          sectionFn: () => (
            <Text fontSize="xs">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Text>
          ),
        },
        {
          title: 'Extra Extra Small',
          sectionFn: () => (
            <Text fontSize="xxs">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog.
            </Text>
          ),
        },
      ],
    },
  ],
})
