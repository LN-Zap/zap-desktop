import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space } from 'styled-system'
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import { FormattedMessage, FormattedDate, injectIntl, intlShape } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, Heading, Panel } from 'components/UI'
import ActivityActions from 'containers/Activity/ActivityActions'
import messages from './messages'
import ActivityListItem from './ActivityListItem'

const StyledList = styled(List)`
  ${space}
  outline: none;
  padding-left: 12px;
`

class Activity extends Component {
  cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 52
  })

  componentDidUpdate() {
    // update list since item heights might have changed
    this.updateList()
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
    const { currentActivity, currentTicker, showExpiredToggle } = this.props

    if (!currentTicker) {
      return null
    }

    return (
      <Panel>
        <Panel.Header>
          <ActivityActions mx={5} mt={3} />
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
  intl: intlShape.isRequired,
  activity: PropTypes.object.isRequired,
  currentActivity: PropTypes.array.isRequired,
  currencyName: PropTypes.string,
  currentTicker: PropTypes.object,
  ticker: PropTypes.object.isRequired,
  showExpiredToggle: PropTypes.bool.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  toggleExpiredRequests: PropTypes.func.isRequired
}

export default injectIntl(Activity)
