import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select } from 'components/UI'

const ActivityFilter = ({ changeFilter, filter, filters, ...rest }) => {
  // Reformat activity filters the way that Select element expects them to be.
  const items = filters.map(f => {
    return {
      key: f.key,
      value: f.name,
    }
  })

  return (
    <Form {...rest}>
      <Select
        field="activity-filter"
        highlightOnValid={false}
        id="activity-filter"
        initialSelectedItem={filter}
        items={items}
        onValueSelected={changeFilter}
      />
    </Form>
  )
}

ActivityFilter.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  filter: PropTypes.string,
  filters: PropTypes.array,
}

ActivityFilter.defaultProps = {
  filters: [],
}

export default ActivityFilter
