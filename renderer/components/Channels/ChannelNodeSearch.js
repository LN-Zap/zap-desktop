import React, { useContext, useRef } from 'react'
import styled, { ThemeContext } from 'styled-components'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import { intlShape } from '@zap/i18n'
import { Bar, Button, Heading, Text } from 'components/UI'
import { Form, SearchInput } from 'components/Form'
import { Truncate } from 'components/Util'
import { withEllipsis } from 'hocs'
import messages from './messages'

const ClippedText = withEllipsis(Text)

const NodeNameContainer = styled(Box)`
  min-width: 0;
`

const SearchResults = ({ filteredNetworkNodes, onClickConnect, ...rest }) => (
  <Box {...rest}>
    {filteredNetworkNodes.map(node => {
      return (
        <React.Fragment key={node.pub_key}>
          <Flex alignItems="center" justifyContent="space-between" pr={2} py={2}>
            <NodeNameContainer mr={3}>
              {node.alias.length > 0 ? (
                <>
                  <ClippedText>{node.alias.trim()}</ClippedText>
                  <Text color="gray" fontSize="s">
                    <Truncate maxlen={25} text={node.pub_key} />
                  </Text>
                </>
              ) : (
                <ClippedText>{node.pub_key}</ClippedText>
              )}
            </NodeNameContainer>
            <Button onClick={() => onClickConnect(node)} size="small" type="button">
              <FormattedMessage {...messages.connect} />
            </Button>
          </Flex>
          <Bar variant="light" />
        </React.Fragment>
      )
    })}
  </Box>
)

SearchResults.propTypes = {
  filteredNetworkNodes: PropTypes.array.isRequired,
  onClickConnect: PropTypes.func.isRequired,
}

const NoSearchResults = () => <Text color="gray">Your seach did not return any results.</Text>

const ChannelNodeSearch = ({
  searchQuery,
  updateContactFormSearchQuery,
  filteredNetworkNodes,
  intl,
  ...rest
}) => {
  const updateContactFormSearchQueryRef = useRef(debounce(updateContactFormSearchQuery, 300))

  /**
   * handleClickConnect - Handle connect to node click.
   *
   * @param {object} node Node
   */
  const handleClickConnect = node => {
    updateContactFormSearchQuery(`${node.pub_key}@${node.addresses[0].addr}`)
  }

  /**
   * handleSearchUpdated - Handle search input update.
   *
   * @param {string} value Search string
   */
  const handleSearchUpdated = value => {
    updateContactFormSearchQueryRef.current(value)
  }

  const theme = useContext(ThemeContext)

  return (
    <Box {...rest} theme={theme}>
      <Box mb={3}>
        <Text textAlign="justify">
          <FormattedMessage {...messages.node_search_form_description} />
        </Text>
      </Box>

      <Form>
        <SearchInput
          description={intl.formatMessage({ ...messages.node_search_description })}
          field="search"
          id="search"
          initialValue={searchQuery}
          isRequired
          onValueChange={handleSearchUpdated}
          placeholder={intl.formatMessage({ ...messages.node_search_placeholder })}
        />
      </Form>

      {searchQuery && (
        <>
          <Heading.h1 mt={4}>
            <FormattedMessage
              {...messages.node_search_results_header}
              values={{ count: filteredNetworkNodes.length }}
            />
          </Heading.h1>
          {filteredNetworkNodes.length > 0 ? (
            <SearchResults
              filteredNetworkNodes={filteredNetworkNodes}
              onClickConnect={handleClickConnect}
            />
          ) : (
            <NoSearchResults />
          )}
        </>
      )}
    </Box>
  )
}

ChannelNodeSearch.propTypes = {
  filteredNetworkNodes: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  searchQuery: PropTypes.string,
  updateContactFormSearchQuery: PropTypes.func.isRequired,
}

export default injectIntl(ChannelNodeSearch)
