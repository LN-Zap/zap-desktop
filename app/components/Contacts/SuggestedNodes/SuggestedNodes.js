import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Button, Spinner, Text } from 'components/UI'
import messages from './messages'

const SuggestedNode = ({ node, nodeClicked, ...rest }) => (
  <Flex justifyContent="space-between" {...rest} alignItems="center">
    <Box css={{ overflow: 'hidden' }}>
      <Text fontWeight="normal">{node.nickname}</Text>
      <Text color="gray" css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {node.pubkey}
      </Text>
    </Box>
    <Box ml={2}>
      <Button type="button" variant="secondary" onClick={() => nodeClicked(node)}>
        <Text fontSize="s">
          <FormattedMessage {...messages.connect} />
        </Text>
      </Button>
    </Box>
  </Flex>
)

const SuggestedNodes = ({
  suggestedNodesLoading,
  suggestedNodes,
  setNode,
  openSubmitChannelForm,
  ...rest
}) => {
  /**
   * Set the node public key and open the submit form.
   */
  const nodeClicked = n => {
    setNode({ pub_key: n.pubkey, addresses: [{ addr: n.host }] })
    openSubmitChannelForm()
  }

  /**
   * Render a list of nodes.
   */
  const renderNodes = () => (
    <>
      <Text mb={4} textAlign="justify">
        <FormattedMessage {...messages.empty_description} />
      </Text>
      {suggestedNodes.map(node => (
        <SuggestedNode key={node.pubkey} node={node} nodeClicked={nodeClicked} mb={2} />
      ))}
    </>
  )

  /**
   * Text to display if no nodes were found.
   */
  const renderAltText = () => (
    <Text>
      <FormattedMessage {...messages.empty_description_alt} />
    </Text>
  )

  return (
    <Box {...rest}>
      {suggestedNodesLoading && (
        <Text textAlign="center">
          <Spinner />
        </Text>
      )}
      {!suggestedNodesLoading && suggestedNodes.length > 0 && renderNodes()}
      {!suggestedNodesLoading && suggestedNodes.length == 0 && renderAltText()}
    </Box>
  )
}

SuggestedNodes.propTypes = {
  suggestedNodesLoading: PropTypes.bool.isRequired,
  suggestedNodes: PropTypes.array.isRequired,
  setNode: PropTypes.func.isRequired,
  openSubmitChannelForm: PropTypes.func.isRequired
}

export default SuggestedNodes
