import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, Form, Input, Panel, Spinner, Text } from 'components/UI'
import { Truncate } from 'components/Util'
import X from 'components/Icon/X'
import messages from './messages'

const AddChannel = ({
  contactsform,
  closeContactsForm,
  openSubmitChannelForm,
  updateContactFormSearchQuery,
  setNode,
  theme,
  activeChannelPubkeys,
  nonActiveChannelPubkeys,
  pendingOpenChannelPubkeys,
  filteredNetworkNodes,
  loadingChannelPubkeys,
  showManualForm,
  openManualForm,
  intl
}) => {
  /**
   * Check if a node can be connected to.
   */
  const canConnect = node =>
    !loadingChannelPubkeys.includes(node.pub_key) &&
    !activeChannelPubkeys.includes(node.pub_key) &&
    !nonActiveChannelPubkeys.includes(node.pub_key) &&
    !pendingOpenChannelPubkeys.includes(node.pub_key) &&
    node.addresses.length

  /**
   * Handle connect to node click.
   */
  const handleClickConnect = node => {
    setNode(node)
    openSubmitChannelForm()
  }

  /**
   * Handle search input update.
   */
  const searchUpdated = search => {
    updateContactFormSearchQuery(search)
  }

  const renderRightSide = node => {
    if (loadingChannelPubkeys.includes(node.pub_key)) {
      return <Spinner />
    }

    if (activeChannelPubkeys.includes(node.pub_key)) {
      return (
        <Text fontSize="s" color="superGreen">
          <FormattedMessage {...messages.online} />
        </Text>
      )
    }

    if (nonActiveChannelPubkeys.includes(node.pub_key)) {
      return (
        <Text fontSize="s" color="gray">
          <FormattedMessage {...messages.offline} />
        </Text>
      )
    }

    if (pendingOpenChannelPubkeys.includes(node.pub_key)) {
      return (
        <Text fontSize="s" color="lightningOrange">
          <FormattedMessage {...messages.pending} />
        </Text>
      )
    }

    if (!node.addresses.length) {
      return (
        <Text fontSize="s" color="gray">
          <FormattedMessage {...messages.private} />
        </Text>
      )
    }

    return (
      <Text fontSize="s">
        <FormattedMessage {...messages.connect} />
      </Text>
    )
  }

  const renderSearchBar = () => {
    return (
      <Flex justifyContent="space-between">
        <Form width={1}>
          <Input
            field="search"
            id="search"
            type="text"
            variant="thin"
            border={0}
            placeholder={intl.formatMessage({ ...messages.search })}
            value={contactsform.searchQuery}
            onChange={event => searchUpdated(event.target.value)}
          />
        </Form>

        <Button variant="secondary" size="small" type="button" onClick={closeContactsForm}>
          <X />
        </Button>
      </Flex>
    )
  }

  return (
    <Panel pt={3}>
      <Panel.Header pt={2} mx={3}>
        {renderSearchBar()}
      </Panel.Header>

      <Bar my={3} borderColor="gray" css={{ opacity: 0.3 }} />

      <Panel.Body css={{ 'overflow-y': 'auto' }}>
        {filteredNetworkNodes.length > 0 &&
          filteredNetworkNodes.map(node => {
            const canConnectToNode = canConnect(node)
            return (
              <Flex
                key={node.pub_key}
                justifyContent="space-between"
                alignItems="center"
                py={2}
                px={3}
                css={
                  canConnectToNode
                    ? {
                        cursor: 'pointer',
                        '&:hover': {
                          'background-color': theme.colors.secondaryColor
                        }
                      }
                    : null
                }
                onClick={canConnectToNode ? () => handleClickConnect(node) : null}
              >
                <Box css={{ overflow: 'hidden' }} mr={3}>
                  {node.alias.length > 0 ? (
                    <>
                      <Text
                        css={{
                          overflow: 'hidden',
                          'white=space': 'nowrap',
                          'text-overflow': 'ellipsis'
                        }}
                      >
                        {node.alias.trim()}
                      </Text>
                      <Text color="gray" fontSize="xs">
                        <Truncate text={node.pub_key} maxlen={25} />
                      </Text>
                    </>
                  ) : (
                    <Text>{node.pub_key}</Text>
                  )}
                </Box>

                <Box>{renderRightSide(node)}</Box>
              </Flex>
            )
          })}

        {showManualForm && (
          <Flex px={3} alignItems="center" flexDirection="column">
            <Text mb={3}>
              <FormattedMessage {...messages.manual_description} />
            </Text>
            <Button onClick={openManualForm} mx="auto">
              <FormattedMessage {...messages.manual_button} />
            </Button>
          </Flex>
        )}
      </Panel.Body>
    </Panel>
  )
}

AddChannel.propTypes = {
  contactsform: PropTypes.object.isRequired,
  closeContactsForm: PropTypes.func.isRequired,
  openSubmitChannelForm: PropTypes.func.isRequired,
  updateContactFormSearchQuery: PropTypes.func.isRequired,
  setNode: PropTypes.func.isRequired,
  activeChannelPubkeys: PropTypes.array.isRequired,
  nonActiveChannelPubkeys: PropTypes.array.isRequired,
  pendingOpenChannelPubkeys: PropTypes.array.isRequired,
  filteredNetworkNodes: PropTypes.array.isRequired,
  loadingChannelPubkeys: PropTypes.array.isRequired,
  showManualForm: PropTypes.bool.isRequired,
  openManualForm: PropTypes.func.isRequired
}

export default injectIntl(withTheme(AddChannel))
