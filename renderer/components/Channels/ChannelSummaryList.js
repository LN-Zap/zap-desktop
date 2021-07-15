import React from 'react'

import PropTypes from 'prop-types'
import { List, AutoSizer } from 'react-virtualized'
import styled from 'styled-components'

import { space as baseSpace } from 'themes/base'

import ChannelSummaryListItem from './ChannelSummaryListItem'

const StyledList = styled(List)`
  outline: none;
  overflow-y: overlay !important;
  overflow-x: hidden !important;
`

const ChannelSummaryList = ({ channels, openModal, setSelectedChannel }) => {
  const ROW_MARGIN_TOP = 3
  // current row height + margin bottom
  const ROW_HEIGHT = 107 + baseSpace[ROW_MARGIN_TOP]

  const isLastItem = index => index === channels.length - 1
  // add some bottom padding for the last item to properly render shadow
  const getRowHeight = ({ index }) =>
    ROW_HEIGHT + (isLastItem(index) ? baseSpace[ROW_MARGIN_TOP] : 0)

  const renderRow = rowProps => {
    const { index, key, style } = rowProps
    const channel = channels[index].channel || channels[index]
    return (
      <div key={key} style={style}>
        <ChannelSummaryListItem
          channel={channel}
          mb={isLastItem(index) ? ROW_MARGIN_TOP : 0}
          mt={ROW_MARGIN_TOP}
          mx={4}
          openModal={openModal}
          setSelectedChannel={setSelectedChannel}
        />
      </div>
    )
  }

  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <StyledList
            height={height}
            pb={3}
            rowCount={channels.length}
            rowHeight={getRowHeight}
            rowRenderer={renderRow}
            width={width}
          />
        )
      }}
    </AutoSizer>
  )
}

ChannelSummaryList.propTypes = {
  channels: PropTypes.array,
  openModal: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
}

ChannelSummaryList.defaultProps = {
  channels: [],
}

export default ChannelSummaryList
