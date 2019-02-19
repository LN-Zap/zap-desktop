import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { withTheme } from 'styled-components'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, Form, Heading, Input, Panel, Text } from 'components/UI'
import { ChannelCreateHeader } from 'components/Channels'
import { Truncate } from 'components/Util'
import withEllipsis from 'components/withEllipsis'
import messages from './messages'

const ClippedText = withEllipsis(Text)

const SearchReasults = ({ filteredNetworkNodes, onClickConnect }) => (
  <Box>
    {filteredNetworkNodes.map(node => {
      return (
        <React.Fragment key={node.pub_key}>
          <Flex justifyContent="space-between" alignItems="center" py={2} pr={2}>
            <Box mr={3}>
              {node.alias.length > 0 ? (
                <>
                  <ClippedText>{node.alias.trim()}</ClippedText>
                  <Text color="gray" fontSize="s">
                    <Truncate text={node.pub_key} maxlen={25} />
                  </Text>
                </>
              ) : (
                <ClippedText>{node.pub_key}</ClippedText>
              )}
            </Box>
            <Button size="small" type="button" onClick={() => onClickConnect(node)}>
              <FormattedMessage {...messages.connect} />
            </Button>
          </Flex>
          <Bar opacity={0.3} />
        </React.Fragment>
      )
    })}
  </Box>
)

SearchReasults.propTypes = {
  filteredNetworkNodes: PropTypes.array.isRequired,
  onClickConnect: PropTypes.func.isRequired
}

class ChannelNodeSearch extends React.PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    searchQuery: PropTypes.string,
    updateContactFormSearchQuery: PropTypes.func.isRequired,
    filteredNetworkNodes: PropTypes.array.isRequired
  }

  /*eslint-disable react/destructuring-assignment*/
  updateContactFormSearchQuery = debounce(this.props.updateContactFormSearchQuery, 300)

  /**
   * Handle connect to node click.
   */
  handleClickConnect = node => {
    this.formApi.setValue('search', `${node.pub_key}@${node.addresses[0].addr}`)
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
      <Panel {...rest}>
        <Panel.Header>
          <ChannelCreateHeader />

          <Bar pt={2} mb={3} />

          <Box mb={3}>
            <Text textAlign="justify">
              <FormattedMessage {...messages.open_channel_form_description} />
            </Text>
          </Box>

          <Form getApi={this.setFormApi}>
            <Input
              field="search"
              id="search"
              type="search"
              label={intl.formatMessage({ ...messages.node_search_label })}
              placeholder={intl.formatMessage({ ...messages.node_search_placeholder })}
              description={intl.formatMessage({ ...messages.node_search_description })}
              onValueChange={this.handleSearchUpdated}
              initialValue={searchQuery}
              required
            />
          </Form>

          {searchQuery && (
            <Heading.h1 pt={3}>
              <FormattedMessage {...messages.node_search_results_header} />
            </Heading.h1>
          )}
        </Panel.Header>

        <Panel.Body css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}>
          {searchQuery && (
            <SearchReasults
              filteredNetworkNodes={filteredNetworkNodes}
              onClickConnect={this.handleClickConnect}
            />
          )}
        </Panel.Body>
      </Panel>
    )
  }
}

export default injectIntl(withTheme(ChannelNodeSearch))
