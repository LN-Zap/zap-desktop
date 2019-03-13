import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import styled from 'styled-components'
import AutopayCardView from './AutopayCardView'
import AutopaySearchNoResults from './AutopaySearchNoResults'

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, 195px);
  grid-gap: 1rem;
  justify-content: space-between;
`

const AutopayList = ({ merchants, ...rest }) => {
  if (merchants.length === 0) {
    return <AutopaySearchNoResults {...rest} />
  }

  return (
    <Box as="article" {...rest}>
      <Grid>
        {merchants.map(merchant => {
          return (
            <Box key={merchant.pubkey} py={2}>
              <AutopayCardView merchant={merchant} onClick={() => alert('NOT IMPLEMENTED')} />
            </Box>
          )
        })}
      </Grid>
    </Box>
  )
}

AutopayList.propTypes = {
  merchants: PropTypes.array,
}

AutopayList.defaultProps = {
  merchants: [],
}

export default AutopayList
