import React from 'react'
import { storiesOf } from '@storybook/react'
import { QRCode } from 'components/UI'

storiesOf('Components', module).addWithChapters('QR Code', {
  subtitle: 'For displaying complex data in an easily scannable format.',
  chapters: [
    {
      sections: [
        {
          title: 'default size',
          sectionFn: () => (
            /* eslint-disable max-len */
            <QRCode value="w35x2gzfdech26tnd96xjan9yqks6cqzysxqr23s8wgz42uvfa833nhl75vxewpmsu3up7dnw5pl3nurp0tcagsl6lg5f3ty" />
          )
        },
        {
          title: 'custom size',
          sectionFn: () => (
            <QRCode
              value="w35x2gzfdech26tnd96xjan9yqks6cqzysxqr23s8wgz42uvfa833nhl75vxewpmsu3up7dnw5pl3nurp0tcagsl6lg5f3ty"
              size="100px"
            />
          )
        }
      ]
    }
  ]
})
