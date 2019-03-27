import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Bar, Panel } from 'components/UI'
import ChannelNodeSearch from 'containers/Channels/ChannelNodeSearch'
import ChannelCreateForm from 'containers/Channels/ChannelCreateForm'
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

          <Panel.Body css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}>
            <Flex alignItems="center" css={{ height: '100%' }} flexDirection="column">
              {isSearchValidNodeAddress ? (
                <ChannelCreateForm onSubmit={onSubmit} width={9 / 16} {...rest} />
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
