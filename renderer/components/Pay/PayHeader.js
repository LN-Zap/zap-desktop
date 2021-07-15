import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import Lightning from 'components/Icon/Lightning'
import Onchain from 'components/Icon/Onchain'
import Send from 'components/Icon/Send'
import { Header } from 'components/UI'

import { PAY_HEADER_TYPES } from './constants'
import messages from './messages'

/**
 * Header for payment form.
 */
class PayHeader extends React.PureComponent {
  static propTypes = {
    title: PropTypes.node.isRequired,
    type: PropTypes.oneOf(Object.values(PAY_HEADER_TYPES)),
  }

  render() {
    const { title, type } = this.props
    let logo
    let subtitle

    switch (type) {
      case PAY_HEADER_TYPES.onchain:
        logo = <Onchain height="45px" width="45px" />
        subtitle = <FormattedMessage {...messages.subtitle_onchain} />
        break
      case PAY_HEADER_TYPES.offchain:
        logo = <Lightning height="45px" width="45px" />
        subtitle = <FormattedMessage {...messages.subtitle_offchain} />
        break
      default:
        logo = <Send height="45px" width="45px" />
    }

    return <Header logo={logo} subtitle={subtitle} title={title} />
  }
}

export default PayHeader
