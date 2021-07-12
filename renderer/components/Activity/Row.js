import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'

import { Bar, Heading } from 'components/UI'
import { FormattedDateTime } from 'containers/UI'

const Row = ({ style, item, RowComponent }) => (
  <div style={style}>
    {item.title ? (
      <Box mt={4} pl={4}>
        <Heading.H4 fontWeight="normal">
          <FormattedDateTime format="date" month="short" value={item.title} />
        </Heading.H4>
        <Bar my={1} />
      </Box>
    ) : (
      <RowComponent activity={item} />
    )}
  </div>
)

Row.propTypes = {
  item: PropTypes.object.isRequired,
  RowComponent: PropTypes.elementType,
  style: PropTypes.object.isRequired,
}

export default Row
