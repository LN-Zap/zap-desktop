import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space } from 'styled-system'
import debounce from 'lodash.debounce'
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import { FormattedMessage, injectIntl, FormattedDate } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, Form, Heading, Input, Panel, Spinner, Tabs } from 'components/UI'
import Search from 'components/Icon/Search'
import X from 'components/Icon/X'
import delay from 'lib/utils/delay'
import messages from './messages'
import ActivityListItem from './ActivityListItem'

const StyledList = styled(List)`
  ${space}
  outline: none;
  padding-left: 12px;
`

class Activity extends Component {
  state = {
    refreshing: false,
    searchText: ''
  }

  cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 52
  })

  /*eslint-disable react/destructuring-assignment*/
  updateSearchText = debounce(this.props.updateSearchText, 300)

  componentDidUpdate() {
    // update list since item heights might have changed
    this.updateList()
  }

  refreshClicked = async () => {
    const { fetchActivityHistory } = this.props
    // turn the spinner on.
    this.setState({ refreshing: true })

    // fetch data
    fetchActivityHistory()

    // Wait a second.
    await delay(1000)

    // Turn the spinner off.
    this.setState({ refreshing: false })
  }

  onSearchTextChange = event => {
    const { value } = event.target
    this.setState({
      searchText: value
    })
    this.updateSearchText(value)
  }

  updateList = () => {
    this.cache.clearAll()
    this._list && this._list.recomputeRowHeights(0)
  }

  onListResize = ({ width }) => {
    // only invalidate row measurement cache if width has actually changed
    if (this._prevListWidth != width) {
      this.updateList()
    }
    this._prevListWidth = width
  }

  renderSearchBar = () => {
    const { updateSearchActive, updateSearchText, intl } = this.props

    const { searchText } = this.state

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
            onChange={this.onSearchTextChange}
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
          <Tabs items={filters} onClick={changeFilter} activeKey={filter} />
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

    const renderRow = ({ index, key, style, parent }) => {
      const item = currentActivity[index]
      return (
        <CellMeasurer key={key} cache={this.cache} parent={parent} columnIndex={0} rowIndex={index}>
          <div style={style}>
            {item.title ? (
              <Box pl={4} mt={4}>
                <Heading.h4 fontWeight="normal">
                  <FormattedDate day="2-digit" month="short" year="numeric" value={item.title} />
                </Heading.h4>
                <Bar py={1} />
              </Box>
            ) : (
              <ActivityListItem
                {...{
                  activity: currentActivity[index],
                  currencyName,
                  currentTicker,
                  showActivityModal,
                  ticker
                }}
              />
            )}
          </div>
        </CellMeasurer>
      )
    }
    return (
      <AutoSizer onResize={this.onListResize}>
        {({ width, height }) => {
          return (
            <StyledList
              pr={5}
              ref={ref => (this._list = ref)}
              width={width}
              height={height}
              rowHeight={this.cache.rowHeight}
              rowRenderer={renderRow}
              rowCount={currentActivity.length}
              deferredMeasurementCache={this.cache}
            />
          )
        }}
      </AutoSizer>
    )
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

        <Panel.Body>{this.renderActivityList()}</Panel.Body>

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
