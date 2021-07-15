import React, { useCallback } from 'react'

import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { AutoSizer, InfiniteLoader } from 'react-virtualized'

import { intlShape } from '@zap/i18n'
import { Panel } from 'components/UI'
import ActivityActions from 'containers/Activity/ActivityActions'

import ActivityListItem from './ActivityListItem'
import ErrorDetailsDialog from './ErrorDetailsDialog'
import List from './List'
import messages from './messages'
import Row from './Row'

const Activity = props => {
  const {
    isErrorDialogOpen,
    hideErrorDetailsDialog,
    errorDialogDetails,
    currentActivity,
    showNotification,
    loadPage,
    intl,
  } = props

  const onErrorDetailsCopy = () => {
    showNotification(intl.formatMessage({ ...messages.error_copied }))
  }

  const renderRow = useCallback(
    ({ index, key, style }) => (
      <Row item={currentActivity[index]} key={key} RowComponent={ActivityListItem} style={style} />
    ),
    [currentActivity]
  )

  const isRowLoaded = ({ index }) => Boolean(currentActivity[index])

  const loadMoreRows = () => loadPage()
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
                <List
                  height={height}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={currentActivity.length}
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
            position="fixed"
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
  loadPage: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(Activity)
