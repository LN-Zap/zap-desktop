import React from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import { Bar, Panel } from 'components/UI'
import ChannelCreateForm from 'containers/Channels/ChannelCreateForm'
import ChannelNodeSearch from 'containers/Channels/ChannelNodeSearch'
import NodeCardList from 'containers/Channels/NodeCardList'

import ChannelCreateHeader from './ChannelCreateHeader'

class ChannelCreate extends React.Component {
  static propTypes = {
    isSearchValidNodeAddress: PropTypes.bool,
    onSubmit: PropTypes.func,
    searchQuery: PropTypes.string,
    updateContactFormSearchQuery: PropTypes.func.isRequired,
  }

  componentWillUnmount() {
    const { updateContactFormSearchQuery } = this.props
    updateContactFormSearchQuery(null)
  }

  render() {
    const { onSubmit, searchQuery, isSearchValidNodeAddress, ...rest } = this.props

    return (
      <>
        <Panel {...rest}>
          <Flex justifyContent="center">
            <Panel.Header width={9 / 16}>
              <ChannelCreateHeader />
              <Bar mb={3} mt={2} />
            </Panel.Header>
          </Flex>

          <Panel.Body sx={{ overflowY: 'overlay', overflowX: 'hidden' }}>
            <Flex alignItems="center" flexDirection="column" height="100%">
              {isSearchValidNodeAddress ? (
                <ChannelCreateForm mx="auto" onSubmit={onSubmit} width={9 / 16} />
              ) : (
                <>
                  <ChannelNodeSearch width={9 / 16} />
                  {!searchQuery && <NodeCardList mt={4} px={4} width={1} />}
                </>
              )}
            </Flex>
          </Panel.Body>
        </Panel>
      </>
    )
  }
}

export default ChannelCreate
