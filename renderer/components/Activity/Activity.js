import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space } from 'styled-system'
import { List, AutoSizer } from 'react-virtualized'
import { FormattedDate, injectIntl, intlShape } from 'react-intl'
import { Box } from 'rebass'
import { Bar, Heading, Panel } from 'components/UI'
import ActivityActions from 'containers/Activity/ActivityActions'
import ActivityListItem from './ActivityListItem'
import ErrorDetailsDialog from './ErrorDetailsDialog'
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
    intl,
  } = props

  const onErrorDetailsCopy = () => {
    showNotification(intl.formatMessage({ ...messages.error_copied }))
  }

  const renderActivityList = () => {
    /**
     * renderRow - renders react virtualized row.
     *
     * @param {*} { index, key, style, parent }
     */
    // eslint-disable-next-line react/prop-types
    const renderRow = ({ index, key, style }) => {
      const item = currentActivity[index]
      return (
        <div key={key} style={style}>
          {item.title ? (
            <Box mt={4} pl={4}>
              <Heading.h4 fontWeight="normal">
                <FormattedDate day="2-digit" month="short" value={item.title} year="numeric" />
              </Heading.h4>
              <Bar my={1} />
            </Box>
          ) : (
            <ActivityListItem activity={currentActivity[index]} />
          )}
        </div>
      )
    }
    return (
      <AutoSizer>
        {({ width, height }) => {
          return (
            <StyledList
              height={height}
              pr={4}
              rowCount={currentActivity.length}
              rowHeight={ROW_HEIGHT}
              rowRenderer={renderRow}
              width={width}
            />
          )
        }}
      </AutoSizer>
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
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(Activity)
