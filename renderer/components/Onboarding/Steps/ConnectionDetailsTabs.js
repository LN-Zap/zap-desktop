import React from 'react'

import { FormattedMessage } from 'react-intl'

import { Tabs } from 'components/UI'

import ConnectionDetailsContext from './ConnectionDetailsContext'
import { FORM_TYPE_CONNECTION_STRING, FORM_TYPE_MANUAL } from './constants'
import messages from './messages'

class ConnectionDetailsTabs extends React.PureComponent {
  items = [
    {
      key: FORM_TYPE_CONNECTION_STRING,
      name: <FormattedMessage {...messages.connection_details_tab_lndconnect} />,
    },
    {
      key: FORM_TYPE_MANUAL,
      name: <FormattedMessage {...messages.connection_details_tab_custom_paths} />,
    },
  ]

  render() {
    return (
      <ConnectionDetailsContext.Consumer>
        {({ formType, openModal }) => {
          return (
            <Tabs activeKey={formType} items={this.items} onClick={openModal} {...this.props} />
          )
        }}
      </ConnectionDetailsContext.Consumer>
    )
  }
}

export default ConnectionDetailsTabs
