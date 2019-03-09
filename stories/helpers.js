import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { Bar, Heading, Page } from 'components/UI'
import lightningPayReq from 'bolt11'

export const Window = props => <Page css={{ height: 'calc(100vh - 40px)' }} {...props} />
export const Column = props => <Box mr={5} width={1 / 2} {...props} />
export const Group = ({ title, children, hasBar = true }) => (
  <Box mb={4}>
    <Heading.h3 fontWeight="normal" mb={2}>
      {title}
    </Heading.h3>
    {hasBar && <Bar mb={3} />}
    {children}
  </Box>
)
Group.propTypes = {
  children: PropTypes.node,
  hasBar: PropTypes.bool,
  title: PropTypes.string,
}
export const Element = props => <Box py={1} {...props} />
export const Content = ({ children }) => (
  <Flex alignItems="center" css={{ height: '100%' }} justifyContent="center">
    <Heading>{children}</Heading>
  </Flex>
)
Content.propTypes = {
  children: PropTypes.node,
}

export const mockCreateInvoice = (coinType, amount, unit = 'satoshis', memo = '') => {
  const data = {
    coinType,
    tags: [
      {
        tagName: 'purpose_commit_hash',
        data: '3925b6f67e2c340036ed12093dd44e0368df1b6ea26c53dbe4811f58fd5db8c1',
      },
      {
        tagName: 'payment_hash',
        data: '0001020304050607080900010203040506070809000102030405060708090102',
      },
      {
        tagName: 'expire_time',
        data: 30,
      },
      {
        tagName: 'description',
        data: memo,
      },
    ],
  }
  data[unit] = amount

  var encoded = lightningPayReq.encode(data)
  var privateKeyHex = 'e126f68f7eafcc8b74f54d269fe206be715000f94dac067d1c04a8ca3b2db734'
  var signed = lightningPayReq.sign(encoded, privateKeyHex)
  return signed.paymentRequest
}
