import React from 'react'
import { storiesOf } from '@storybook/react'
import { QRCode } from 'components/UI'

storiesOf('Components', module).addWithChapters('QR Code', {
  subtitle: 'For displaying complex data in an easily scannable format.',
  chapters: [
    {
      sections: [
        {
          title: 'small',
          sectionFn: () => (
            /* eslint-disable max-len */
            <QRCode
              size="small"
              value="LNBC50N1PWRXM0CPP5H0SFHH3484XMJ6DHZA33MUKD0J4HG25AEGWZ5VPUQQZGQMQ9RLDQDPSDP68GURN8GHJ7MRFVA58GMNFDENJ6UN0W4KX2AR5V5HXXMMDCQZYSXQYP2XQ7XLTG2QGD7Y908EFJ524C4LAQZ5L3K0Y88E0M2V4LCUE7WKQXJDHCLDYMXPLLEEP9ZCNLTYY9NMWHF2J6NYCK2N0XXC85X8UPNGQYYGQU7G5UT"
            />
          )
        },
        {
          title: 'medium',
          sectionFn: () => (
            /* eslint-disable max-len */
            <QRCode
              size="medium"
              value="LNBC50N1PWRXM0CPP5H0SFHH3484XMJ6DHZA33MUKD0J4HG25AEGWZ5VPUQQZGQMQ9RLDQDPSDP68GURN8GHJ7MRFVA58GMNFDENJ6UN0W4KX2AR5V5HXXMMDCQZYSXQYP2XQ7XLTG2QGD7Y908EFJ524C4LAQZ5L3K0Y88E0M2V4LCUE7WKQXJDHCLDYMXPLLEEP9ZCNLTYY9NMWHF2J6NYCK2N0XXC85X8UPNGQYYGQU7G5UT"
            />
          )
        },
        {
          title: 'large',
          sectionFn: () => (
            /* eslint-disable max-len */
            <QRCode
              size="large"
              value="LNBC50N1PWRXM0CPP5H0SFHH3484XMJ6DHZA33MUKD0J4HG25AEGWZ5VPUQQZGQMQ9RLDQDPSDP68GURN8GHJ7MRFVA58GMNFDENJ6UN0W4KX2AR5V5HXXMMDCQZYSXQYP2XQ7XLTG2QGD7Y908EFJ524C4LAQZ5L3K0Y88E0M2V4LCUE7WKQXJDHCLDYMXPLLEEP9ZCNLTYY9NMWHF2J6NYCK2N0XXC85X8UPNGQYYGQU7G5UT"
            />
          )
        }
      ]
    }
  ]
})
