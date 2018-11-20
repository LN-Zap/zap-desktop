import React from 'react'
import PropTypes from 'prop-types'
import { Heading } from 'components/UI'
import { Textfit } from 'react-textfit'

const WalletHeader = ({ title }) => (
  <Heading.h1>
    <Textfit mode="single" min={16} max={60}>
      {title}
    </Textfit>
  </Heading.h1>
)

WalletHeader.propTypes = {
  title: PropTypes.string.isRequired
}

export default WalletHeader
