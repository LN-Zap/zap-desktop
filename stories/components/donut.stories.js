import React from 'react'

import { storiesOf } from '@storybook/react'

import { Donut } from 'components/UI'

storiesOf('Components', module).addWithChapters('Donut', {
  subtitle: 'For visualizing data.',
  info: `The Donut component is used to visualize a data series in a dunut chart.`,
  chapters: [
    {
      sections: [
        {
          title: 'Empty',
          sectionFn: () => <Donut height={200} width={200} />,
        },
        {
          title: 'Basic',
          sectionFn: () => (
            <Donut
              data={[
                {
                  key: 'lightning',
                  amount: 0.5,
                  color: 'primaryAccent',
                  withGlow: true,
                  withTint: true,
                },
              ]}
              height={200}
              width={200}
            />
          ),
        },
        {
          title: 'With text',
          sectionFn: () => (
            <Donut
              data={[
                {
                  key: 'lightning',
                  amount: 0.25,
                  color: 'primaryAccent',
                  withGlow: true,
                  withTint: true,
                },
                {
                  key: 'pending',
                  amount: 0.4,
                  color: 'gray',
                  withGlow: false,
                  withTint: false,
                },
                {
                  key: 'onchain',
                  amount: 0.35,
                  color: 'secondaryColor',
                  withGlow: false,
                  withTint: true,
                },
              ]}
              height={200}
              text={10}
              width={200}
            />
          ),
        },
      ],
    },
  ],
})
