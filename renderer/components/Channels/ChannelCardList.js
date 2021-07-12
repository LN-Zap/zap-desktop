import React from 'react'

import PropTypes from 'prop-types'
import { Grid, AutoSizer } from 'react-virtualized'
import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

import { space as baseSpace } from 'themes/base'

import ChannelCardListItem from './ChannelCardListItem'

const StyledList = styled(Grid)`
  outline: none;
  overflow-y: overlay !important;
  overflow-x: hidden !important;
`
const ChannelCardList = ({
  channels,
  cryptoUnitName,
  openModal,
  setSelectedChannel,
  networkInfo,
}) => {
  const ROW_PADDING_BOTTOM = 3
  // current row height + margin bottom
  const ROW_HEIGHT = 446 + baseSpace[ROW_PADDING_BOTTOM]
  const renderRow = rowProps => {
    const { columnIndex, rowIndex, key, style } = rowProps
    const index = rowIndex * 2 + columnIndex
    // index may exceed total number of elements because of 2 column layout
    if (index >= channels.length) {
      return null
    }

    const channel = channels[index].channel || channels[index]
    return (
      <Box
        key={key}
        pb={ROW_PADDING_BOTTOM}
        pl={index % 2 ? 3 : 4}
        pr={index % 2 ? 4 : 3}
        pt={3}
        style={style}
        width={1 / 2}
      >
        <ChannelCardListItem
          channel={channel}
          cryptoUnitName={cryptoUnitName}
          height="100%"
          networkInfo={networkInfo}
          openModal={openModal}
          setSelectedChannel={setSelectedChannel}
        />
      </Box>
    )
  }

  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <StyledList
            cellRenderer={renderRow}
            columnCount={2}
            columnWidth={width / 2}
            height={height}
            overscanRowCount={5}
            rowCount={Math.ceil(channels.length / 2)}
            rowHeight={ROW_HEIGHT}
            width={width}
          />
        )
      }}
    </AutoSizer>
  )
}

ChannelCardList.propTypes = {
  channels: PropTypes.array,
  cryptoUnitName: PropTypes.string.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  openModal: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
}

ChannelCardList.defaultProps = {
  channels: [],
}

export default ChannelCardList
