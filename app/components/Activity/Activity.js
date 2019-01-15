import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, Form, Heading, Input, Panel, Spinner, Text } from 'components/UI'
import Search from 'components/Icon/Search'
import X from 'components/Icon/X'

import messages from './messages'
import ActivityListItem from './ActivityListItem'

class Activity extends Component {
  state = {
    refreshing: false
  }

  refreshClicked = () => {
    const { fetchActivityHistory } = this.props
    // turn the spinner on
    this.setState({ refreshing: true })

    // fetch data
    fetchActivityHistory()

    // Turn the spinner off after 1 second.
    const refreshTimeout = setTimeout(() => {
      this.setState({ refreshing: false })
      clearTimeout(refreshTimeout)
    }, 1000)
  }

  renderSearchBar = () => {
    const {
      activity: { searchText },
      updateSearchActive,
      updateSearchText,
      intl
    } = this.props
    return (
      <>
        <Form width={1}>
          <Input
            autoFocus
            field="search"
            id="search"
            type="text"
            variant="thin"
            border={0}
            placeholder={intl.formatMessage({ ...messages.search })}
            value={searchText}
            onChange={event => updateSearchText(event.target.value)}
          />
        </Form>

        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={() => {
            updateSearchActive(false)
            updateSearchText('')
          }}
        >
          <X />
        </Button>
      </>
    )
  }

  renderControlBar = () => {
    const {
      activity: { filters, filter },
      changeFilter,
      updateSearchActive
    } = this.props
    const { refreshing } = this.state

    return (
      <>
        <Flex justifyContent="space-between" alignItems="center">
          {filters.map(f => (
            <Flex mr={3} key={f.key} flexDirection="column" alignItems="center">
              <Button
                variant="secondary"
                size="small"
                onClick={() => changeFilter(f)}
                px={3}
                active={f.key === filter.key}
              >
                <Text fontWeight="normal">
                  <FormattedMessage {...messages[f.name]} />
                </Text>
              </Button>
              {f.key === filter.key && (
                <Bar
                  width={1}
                  borderColor="lightningOrange"
                  opacity={1}
                  css={{ 'max-width': '50px' }}
                />
              )}
            </Flex>
          ))}
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Button variant="secondary" onClick={this.refreshClicked} mr={3} px={3}>
            {refreshing ? <Spinner /> : <FormattedMessage {...messages.refresh} />}
          </Button>
          <Button variant="secondary" onClick={() => updateSearchActive(true)}>
            <Search />
          </Button>
        </Flex>
      </>
    )
  }

  renderActivityList = () => {
    const { currentActivity, currencyName, ticker, currentTicker, showActivityModal } = this.props

    if (!currencyName) {
      return null
    }

    return currentActivity.map((activityBlock, index) => (
      <Box key={index} mb={4}>
        <Heading.h4 fontWeight="normal">{activityBlock.title}</Heading.h4>
        <Bar py={1} />
        {activityBlock.activity.map((activity, i) => (
          <ActivityListItem
            key={i}
            {...{
              activity,
              currencyName,
              currentTicker,
              showActivityModal,
              ticker
            }}
          />
        ))}
      </Box>
    ))
  }

  renderFooterControls = () => {
    const {
      activity: { showExpiredRequests },
      toggleExpiredRequests
    } = this.props

    return (
      <Flex justifyContent="center">
        <Button size="small" onClick={toggleExpiredRequests} mx="auto">
          <FormattedMessage {...messages[showExpiredRequests ? 'hide_expired' : 'show_expired']} />
        </Button>
      </Flex>
    )
  }

  render() {
    const {
      activity: { searchActive },
      currentActivity,
      currentTicker,
      showExpiredToggle
    } = this.props

    if (!currentTicker) {
      return null
    }

    return (
      <Panel>
        <Panel.Header>
          <Flex
            as="nav"
            justifyContent="space-between"
            alignItems="center"
            mx={5}
            mt={3}
            css={{ height: '50px' }}
          >
            {searchActive ? this.renderSearchBar() : this.renderControlBar()}
          </Flex>
        </Panel.Header>

        <Panel.Body py={3} css={{ 'overflow-y': 'auto' }}>
          <Box as="section" mx={5} mt={3}>
            {this.renderActivityList()}
          </Box>
        </Panel.Body>

        {showExpiredToggle && currentActivity.length > 0 && (
          <Panel.Footer py={2}>{this.renderFooterControls()}</Panel.Footer>
        )}
      </Panel>
    )
  }
}

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
  currentActivity: PropTypes.array.isRequired,
  currencyName: PropTypes.string,
  currentTicker: PropTypes.object,
  ticker: PropTypes.object.isRequired,
  showExpiredToggle: PropTypes.bool.isRequired,

  changeFilter: PropTypes.func.isRequired,
  fetchActivityHistory: PropTypes.func.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  toggleExpiredRequests: PropTypes.func.isRequired,
  updateSearchActive: PropTypes.func.isRequired,
  updateSearchText: PropTypes.func.isRequired
}

export default injectIntl(Activity)
