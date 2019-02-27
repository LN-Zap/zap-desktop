import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { List, AutoSizer } from 'react-virtualized'
import { ChannelSummaryListItem } from 'components/Channels'
import { space as baseSpace } from 'themes/base'

const StyledList = styled(List)`
  outline: none;
  overflow-y: overlay !important;
  overflow-x: hidden !important;
`

const ChannelSummaryList = ({ channels, openModal, setSelectedChannel }) => {
  const ROW_MARGIN_TOP = 3
  // current row height + margin bottom
  const ROW_HEIGHT = 107 + baseSpace[ROW_MARGIN_TOP]

  const renderRow = rowProps => {
    const { index, key, style } = rowProps
    const channel = channels[index].channel || channels[index]
    return (
      <div style={style} key={key}>
        <ChannelSummaryListItem
          mx={4}
          channel={channel}
          openModal={openModal}
          setSelectedChannel={setSelectedChannel}
          mt={ROW_MARGIN_TOP}
        />
      </div>
    )
  }

  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <StyledList
            width={width}
            height={height}
            rowHeight={ROW_HEIGHT}
            rowRenderer={renderRow}
            rowCount={channels.length}
          />
        )
      }}
    </AutoSizer>
  )
}

ChannelSummaryList.propTypes = {
  channels: PropTypes.array,
  openModal: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired
}

ChannelSummaryList.defaultProps = {
  channels: []
}

export default ChannelSummaryList
