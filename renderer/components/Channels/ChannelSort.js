import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select } from 'components/UI'

const ChannelSort = ({ changeSort, sort, sorters, ...rest }) => {
  // Reformat channel filters the way that Select element expects them to be.
  const items = sorters.map(f => {
    return {
      key: f.key,
      value: f.name,
    }
  })

  return (
    <Form {...rest}>
      <Select
        field="channel-sort"
        highlightOnValid={false}
        id="channel-filter"
        initialSelectedItem={sort}
        items={items}
        onValueSelected={changeSort}
        width={1}
      />
    </Form>
  )
}

ChannelSort.propTypes = {
  changeSort: PropTypes.func.isRequired,
  sort: PropTypes.string,
  sorters: PropTypes.array,
}

ChannelSort.defaultProps = {
  sort: [],
}

export default ChannelSort
