import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space } from 'styled-system'
import { List, AutoSizer, InfiniteLoader } from 'react-virtualized'
import { injectIntl } from 'react-intl'
import { intlShape } from '@zap/i18n'
import { Panel } from 'components/UI'
import ActivityActions from 'containers/Activity/ActivityActions'
import ErrorDetailsDialog from './ErrorDetailsDialog'
import ActivityListItem from './ActivityListItem'
import Row from './Row'
import messages from './messages'

const ROW_HEIGHT = 53

const StyledList = styled(List)`
  ${space}
  outline: none;
  padding-left: 12px;
`

const Activity = props => {
  const {
    isErrorDialogOpen,
    hideErrorDetailsDialog,
    errorDialogDetails,
    currentActivity,
    showNotification,
    loadNextPage,
    intl,
  } = props

  const onErrorDetailsCopy = () => {
    showNotification(intl.formatMessage({ ...messages.error_copied }))
  }

  const renderRow = useCallback(
    ({ index, key, style }) => (
      <Row key={key} item={currentActivity[index]} RowComponent={ActivityListItem} style={style} />
    ),
    [currentActivity]
  )

  const isRowLoaded = ({ index }) => Boolean(currentActivity[index])

  const loadMoreRows = () => {
    loadNextPage()
  }

  const renderActivityList = () => {
    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={Number.MAX_SAFE_INTEGER}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ width, height }) => {
              return (
                <StyledList
                  ref={registerChild}
                  height={height}
                  onRowsRendered={onRowsRendered}
                  pr={4}
                  rowCount={currentActivity.length}
                  rowHeight={ROW_HEIGHT}
                  rowRenderer={renderRow}
                  width={width}
                />
              )
            }}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }

  return (
    <Panel>
      <Panel.Header my={3} px={4}>
        <ActivityActions />
      </Panel.Header>
      <Panel.Body>
        <>
          {renderActivityList()}
          <ErrorDetailsDialog
            error={errorDialogDetails}
            isOpen={isErrorDialogOpen}
            onClose={hideErrorDetailsDialog}
            onCopy={onErrorDetailsCopy}
          />
        </>
      </Panel.Body>
    </Panel>
  )
}

Activity.propTypes = {
  currentActivity: PropTypes.array.isRequired,
  errorDialogDetails: PropTypes.object,
  hideErrorDetailsDialog: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  isErrorDialogOpen: PropTypes.bool,
  loadNextPage: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(Activity)
