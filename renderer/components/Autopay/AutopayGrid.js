import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

import AutopayCardView from './AutopayCardView'

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, 195px);
  grid-gap: 1rem;
`

const AutopayGrid = ({ items, onClick }) => (
  <Grid>
    {items.map(item => {
      return (
        <Box key={item.pubkey} py={2}>
          <AutopayCardView merchant={item} onClick={onClick} />
        </Box>
      )
    })}
  </Grid>
)

AutopayGrid.propTypes = {
  items: PropTypes.array,
  onClick: PropTypes.func.isRequired,
}

export default AutopayGrid
