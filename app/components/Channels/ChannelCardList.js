import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import styled from 'styled-components'
import { Grid, AutoSizer } from 'react-virtualized'
import { space as baseSpace } from 'themes/base'
import ChannelCardListItem from './ChannelCardListItem'

const StyledList = styled(Grid)`
  outline: none;
  overflow-y: overlay !important;
  overflow-x: hidden !important;
`

const ChannelCardList = ({
  channels,
  currencyName,
  openModal,
  setSelectedChannel,
  networkInfo
}) => {
  const ROW_PADDING_BOTTOM = 3
  // current row height + margin bottom
  const ROW_HEIGHT = 392 + baseSpace[ROW_PADDING_BOTTOM]
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
        width={1 / 2}
        pr={index % 2 ? 4 : 3}
        pl={index % 2 ? 3 : 4}
        pt={3}
        pb={ROW_PADDING_BOTTOM}
        style={style}
        key={key}
      >
        <ChannelCardListItem
          channel={channel}
          currencyName={currencyName}
          openModal={openModal}
          setSelectedChannel={setSelectedChannel}
          networkInfo={networkInfo}
          css={{ height: '100%' }}
        />
      </Box>
    )
  }

  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <StyledList
            width={width}
            height={height}
            columnCount={2}
            columnWidth={width / 2}
            rowHeight={ROW_HEIGHT}
            cellRenderer={renderRow}
            rowCount={Math.ceil(channels.length / 2)}
          />
        )
      }}
    </AutoSizer>
  )
}

ChannelCardList.propTypes = {
  channels: PropTypes.array,
  currencyName: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

ChannelCardList.defaultProps = {
  channels: []
}

export default ChannelCardList
