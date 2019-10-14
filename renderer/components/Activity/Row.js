import React from 'react'
import PropTypes from 'prop-types'
import { FormattedDate } from 'react-intl'
import { Box } from 'rebass/styled-components'
import { Bar, Heading } from 'components/UI'

const Row = ({ style, item, RowComponent }) => (
  <div style={style}>
    {item.title ? (
      <Box mt={4} pl={4}>
        <Heading.h4 fontWeight="normal">
          <FormattedDate day="2-digit" month="short" value={item.title} year="numeric" />
        </Heading.h4>
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
