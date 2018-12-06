import React from 'react'
import PropTypes from 'prop-types'
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
  updateManualFormSearchQuery,
  setNode,
  activeChannelPubkeys,
  nonActiveChannelPubkeys,
  pendingOpenChannelPubkeys,
  filteredNetworkNodes,
  loadingChannelPubkeys,
  showManualForm,
  openManualForm,
  intl
}) => {
  const renderRightSide = node => {
    if (loadingChannelPubkeys.includes(node.pub_key)) {
      return <Spinner />
    }

    if (activeChannelPubkeys.includes(node.pub_key)) {
      return (
        <Text color="superGreen">
          <FormattedMessage {...messages.online} />
        </Text>
      )
    }

    if (nonActiveChannelPubkeys.includes(node.pub_key)) {
      return (
        <Text color="gray">
          <FormattedMessage {...messages.offline} />
        </Text>
      )
    }

    if (pendingOpenChannelPubkeys.includes(node.pub_key)) {
      return (
        <Text color="lightningOrange">
          <FormattedMessage {...messages.pending} />
        </Text>
      )
    }

    if (!node.addresses.length) {
      return (
        <Text color="gray">
          <FormattedMessage {...messages.private} />
        </Text>
      )
    }

    return (
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => {
          // set the node public key for the submit form
          setNode(node)
          // open the submit form
          openSubmitChannelForm()
        }}
      >
        <Text fontSize="s">
          <FormattedMessage {...messages.connect} />
        </Text>
      </Button>
    )
  }

  const searchUpdated = search => {
    updateContactFormSearchQuery(search)

    if (search.includes('@') && search.split('@')[0].length === 66) {
      updateManualFormSearchQuery(search)
    }
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
    <Panel mx={3} mt={4}>
      <Panel.Header>{renderSearchBar()}</Panel.Header>

      <Bar my={3} mx={-3} borderColor="gray" css={{ opacity: 0.3 }} />

      <Panel.Body>
        {filteredNetworkNodes.length > 0 &&
          filteredNetworkNodes.map(node => (
            <Flex key={node.pub_key} justifyContent="space-between" alignItems="center" py={2}>
              <Box>
                {node.alias.length > 0 ? (
                  <>
                    <Text>{node.alias.trim()}</Text>
                    <Text color="gray" fontSize="s">
                      <Truncate text={node.pub_key} maxlen={25} />
                    </Text>
                  </>
                ) : (
                  <Text>{node.pub_key}</Text>
                )}
              </Box>

              <Box>{renderRightSide(node)}</Box>
            </Flex>
          ))}

        {showManualForm && (
          <>
            <Text mb={3}>
              <FormattedMessage {...messages.manual_description} />
            </Text>
            <Button onClick={openManualForm} variant="primary" width={1}>
              <FormattedMessage {...messages.manual_button} />
            </Button>
          </>
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
  updateManualFormSearchQuery: PropTypes.func.isRequired,
  setNode: PropTypes.func.isRequired,
  activeChannelPubkeys: PropTypes.array.isRequired,
  nonActiveChannelPubkeys: PropTypes.array.isRequired,
  pendingOpenChannelPubkeys: PropTypes.array.isRequired,
  filteredNetworkNodes: PropTypes.array.isRequired,
  loadingChannelPubkeys: PropTypes.array.isRequired,
  showManualForm: PropTypes.bool.isRequired,
  openManualForm: PropTypes.func.isRequired
}

export default injectIntl(AddChannel)
