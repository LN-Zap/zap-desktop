import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, Form, Heading, Input, Panel, Spinner, Text } from 'components/UI'
import Search from 'components/Icon/Search'
import X from 'components/Icon/X'
import ChainLink from 'components/Icon/ChainLink'
import Clock from 'components/Icon/Clock'
import Zap from 'components/Icon/Zap'
import Wallet from 'components/Wallet'
import Invoice from './Invoice'
import Payment from './Payment'
import Transaction from './Transaction'
import messages from './messages'

const ActivityIcon = ({ activity }) => {
  switch (activity.type) {
    case 'transaction':
      return <ChainLink />
    case 'payment':
      return <Zap width="1.6em" height="1.6em" />
    case 'invoice':
      return <Clock />
    default:
      return null
  }
}

const ActivityListItem = ({
  activity,
  currencyName,
  currentTicker,
  network,
  ticker,
  showActivityModal,
  ...rest
}) => (
  <Flex justifyContent="space-between" alignItems="center" {...rest}>
    <Text width={24} ml={-35} color="gray" textAlign="center">
      <ActivityIcon activity={activity} />
    </Text>
    <Box width={1} css={!activity.sending ? { cursor: 'pointer' } : null}>
      {activity.type === 'transaction' && (
        <Transaction
          transaction={activity}
          ticker={ticker}
          currentTicker={currentTicker}
          showActivityModal={showActivityModal}
          currencyName={currencyName}
        />
      )}

      {activity.type === 'invoice' && (
        <Invoice
          invoice={activity}
          ticker={ticker}
          currentTicker={currentTicker}
          showActivityModal={showActivityModal}
          currencyName={currencyName}
        />
      )}

      {activity.type === 'payment' && (
        <Payment
          payment={activity}
          ticker={ticker}
          currentTicker={currentTicker}
          showActivityModal={showActivityModal}
          nodes={network.nodes}
          currencyName={currencyName}
        />
      )}
    </Box>
  </Flex>
)

class Activity extends Component {
  state = {
    refreshing: false
  }

  componentDidMount() {
    this.refreshClicked()
  }

  refreshClicked = () => {
    const { fetchPayments, fetchInvoices, fetchTransactions, fetchBalance } = this.props
    // turn the spinner on
    this.setState({ refreshing: true })

    // fetch data
    fetchBalance()
    fetchPayments()
    fetchInvoices()
    fetchTransactions()

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
    const {
      currentActivity,
      currencyName,
      ticker,
      currentTicker,
      showActivityModal,
      network
    } = this.props

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
              network,
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
      balance,
      currentActivity,
      currentTicker,
      walletProps,
      showExpiredToggle
    } = this.props

    if (!currentTicker || balance.channelBalance === null || balance.walletBalance === null) {
      return null
    }

    return (
      <Panel>
        <Panel.Header>
          <Wallet {...walletProps} />

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

        <Panel.Body py={3}>
          <Box as="section" mx={5} mt={3}>
            {this.renderActivityList()}
          </Box>
        </Panel.Body>

        {showExpiredToggle &&
          currentActivity.length > 0 && (
            <Panel.Footer py={2}>{this.renderFooterControls()}</Panel.Footer>
          )}
      </Panel>
    )
  }
}

Activity.propTypes = {
  fetchPayments: PropTypes.func.isRequired,
  fetchInvoices: PropTypes.func.isRequired,
  fetchTransactions: PropTypes.func.isRequired,
  fetchBalance: PropTypes.func.isRequired,

  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object,
  network: PropTypes.object.isRequired,

  showActivityModal: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  updateSearchActive: PropTypes.func.isRequired,
  updateSearchText: PropTypes.func.isRequired,
  toggleExpiredRequests: PropTypes.func.isRequired,

  activity: PropTypes.object.isRequired,
  currentActivity: PropTypes.array.isRequired,
  showExpiredToggle: PropTypes.bool.isRequired,
  balance: PropTypes.object.isRequired,
  walletProps: PropTypes.object.isRequired,

  currencyName: PropTypes.string
}

export default injectIntl(Activity)
