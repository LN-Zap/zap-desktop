import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import styled, { withTheme } from 'styled-components'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, Form, Heading, Input, Text } from 'components/UI'
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

class ChannelNodeSearch extends React.PureComponent {
  static propTypes = {
    filteredNetworkNodes: PropTypes.array.isRequired,
    intl: intlShape.isRequired,
    searchQuery: PropTypes.string,
    updateContactFormSearchQuery: PropTypes.func.isRequired,
  }

  /*eslint-disable react/destructuring-assignment*/
  updateContactFormSearchQuery = debounce(this.props.updateContactFormSearchQuery, 300)

  /**
   * Handle connect to node click.
   */
  handleClickConnect = node => {
    const { updateContactFormSearchQuery } = this.props
    updateContactFormSearchQuery(`${node.pub_key}@${node.addresses[0].addr}`)
  }

  /**
   * Handle search input update.
   */
  handleSearchUpdated = value => {
    this.updateContactFormSearchQuery(value)
  }

  /**
   * Store the formApi on the component context to make it available at this.formApi.
   */
  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const {
      searchQuery,
      updateContactFormSearchQuery,
      filteredNetworkNodes,
      intl,
      ...rest
    } = this.props

    return (
      <Box {...rest}>
        <Box mb={3}>
          <Text textAlign="justify">
            <FormattedMessage {...messages.node_search_form_description} />
          </Text>
        </Box>

        <Form getApi={this.setFormApi}>
          <Input
            description={intl.formatMessage({ ...messages.node_search_description })}
            field="search"
            id="search"
            initialValue={searchQuery}
            isRequired
            onValueChange={this.handleSearchUpdated}
            placeholder={intl.formatMessage({ ...messages.node_search_placeholder })}
            type="search"
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
                onClickConnect={this.handleClickConnect}
              />
            ) : (
              <NoSearchResults />
            )}
          </>
        )}
      </Box>
    )
  }
}

export default injectIntl(withTheme(ChannelNodeSearch))
