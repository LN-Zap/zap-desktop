import React from 'react'

import { storiesOf } from '@storybook/react'

import { QRCode } from 'components/UI'

/* eslint-disable max-len */
const code =
  'LNBC50N1PWRXM0CPP5H0SFHH3484XMJ6DHZA33MUKD0J4HG25AEGWZ5VPUQQZGQMQ9RLDQDPSDP68GURN8GHJ7MRFVA58GMNFDENJ6UN0W4KX2AR5V5HXXMMDCQZYSXQYP2XQ7XLTG2QGD7Y908EFJ524C4LAQZ5L3K0Y88E0M2V4LCUE7WKQXJDHCLDYMXPLLEEP9ZCNLTYY9NMWHF2J6NYCK2N0XXC85X8UPNGQYYGQU7G5UT'

storiesOf('Components', module).addWithChapters('QR Code', {
  subtitle: 'For displaying complex data in an easily scannable format.',
  chapters: [
    {
      sections: [
        {
          title: 'small',
          sectionFn: () => (
            /* eslint-disable max-len */
            <>
              <QRCode mr={4} size="small" value={code} />
              <QRCode isObfuscated size="small" value={code} />
            </>
          ),
        },
        {
          title: 'medium',
          sectionFn: () => (
            <>
              <QRCode mr={4} size="medium" value={code} />
              <QRCode isObfuscated size="medium" value={code} />
            </>
          ),
        },
        {
          title: 'large',
          sectionFn: () => (
            <>
              <QRCode mr={4} size="large" value={code} />
              <QRCode isObfuscated size="large" value={code} />
            </>
          ),
        },
      ],
    },
  ],
})
