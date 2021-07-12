import React from 'react'

import PropTypes from 'prop-types'
import { Textfit } from 'react-textfit'

import { Heading } from 'components/UI'
import { WalletName } from 'components/Util'

const WalletHeader = ({ wallet }) => (
  <Heading.H1>
    <Textfit max={60} min={16} mode="single">
      <WalletName wallet={wallet} />
    </Textfit>
  </Heading.H1>
)

WalletHeader.propTypes = {
  wallet: PropTypes.object.isRequired,
}

export default WalletHeader
