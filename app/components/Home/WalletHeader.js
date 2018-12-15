import React from 'react'
import PropTypes from 'prop-types'
import { Heading } from 'components/UI'
import { Textfit } from 'react-textfit'
import { WalletName } from 'components/Util'

const WalletHeader = ({ wallet }) => (
  <Heading.h1>
    <Textfit mode="single" min={16} max={60}>
      <WalletName wallet={wallet} />
    </Textfit>
  </Heading.h1>
)

WalletHeader.propTypes = {
  wallet: PropTypes.object.isRequired
}

export default WalletHeader
