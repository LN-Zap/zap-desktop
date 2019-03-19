import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDebounce } from 'hooks'
import { Form, Input } from 'components/UI'

const ActivitySearch = ({ searchQuery, placeholder, updateActivitySearchQuery, ...rest }) => {
  const [value, setValue] = useState()
  useDebounce(updateActivitySearchQuery, value)

  return (
    <Form {...rest}>
      <Input
        field="activity-search"
        highlightOnValid={false}
        id="activity-search"
        initialValue={searchQuery}
        mr={2}
        onValueChange={setValue}
        placeholder={placeholder}
        type="search"
      />
    </Form>
  )
}

ActivitySearch.propTypes = {
  placeholder: PropTypes.string.isRequired,
  searchQuery: PropTypes.string,
  updateActivitySearchQuery: PropTypes.func.isRequired,
}

export default ActivitySearch
