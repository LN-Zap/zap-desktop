import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Header } from 'components/UI'
import Lightning from 'components/Icon/Lightning'
import Onchain from 'components/Icon/Onchain'
import Send from 'components/Icon/Send'
import messages from './messages'

/**
 * Header for opayment form.
 */
class PayHeader extends React.PureComponent {
  static propTypes = {
    title: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['onchain', 'offchain']),
  }

  render() {
    const { title, type } = this.props
    let logo, subtitle

    switch (type) {
      case 'onchain':
        logo = <Onchain height="45px" width="45px" />
        subtitle = <FormattedMessage {...messages.subtitle_onchain} />
        break
      case 'offchain':
        logo = <Lightning height="45px" width="45px" />
        subtitle = <FormattedMessage {...messages.subtitle_offchain} />
        break
      default:
        logo = <Send height="45px" width="45px" />
        subtitle = <span>&nbsp;</span>
    }

    return <Header logo={logo} subtitle={subtitle} title={title} />
  }
}

export default PayHeader
