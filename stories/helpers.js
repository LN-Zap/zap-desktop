import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { Bar, Heading, Page } from 'components/UI'
import lightningPayReq from 'bolt11'

export const Window = props => <Page css={{ height: 'calc(100vh - 40px)' }} {...props} />
export const Column = props => <Box width={1 / 2} mr={5} {...props} />
export const Group = ({ title, children, withBar = true }) => (
  <Box mb={4}>
    <Heading.h3 mb={2} fontWeight="normal">
      {title}
    </Heading.h3>
    {withBar && <Bar mb={3} />}
    {children}
  </Box>
)
Group.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  withBar: PropTypes.bool
}
export const Element = props => <Box py={1} {...props} />
export const Content = ({ children }) => (
  <Flex justifyContent="center" alignItems="center" css={{ height: '100%' }}>
    <Heading>{children}</Heading>
  </Flex>
)
Content.propTypes = {
  children: PropTypes.node
}

export const mockCreateInvoice = (coinType, amount, unit = 'satoshis', memo = '') => {
  const data = {
    coinType,
    tags: [
      {
        tagName: 'purpose_commit_hash',
        data: '3925b6f67e2c340036ed12093dd44e0368df1b6ea26c53dbe4811f58fd5db8c1'
      },
      {
        tagName: 'payment_hash',
        data: '0001020304050607080900010203040506070809000102030405060708090102'
      },
      {
        tagName: 'expire_time',
        data: 30
      },
      {
        tagName: 'description',
        data: memo
      }
    ]
  }
  data[unit] = amount

  var encoded = lightningPayReq.encode(data)
  var privateKeyHex = 'e126f68f7eafcc8b74f54d269fe206be715000f94dac067d1c04a8ca3b2db734'
  var signed = lightningPayReq.sign(encoded, privateKeyHex)
  return signed.paymentRequest
}
