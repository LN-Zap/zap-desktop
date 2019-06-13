import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDebounce } from 'hooks'
import { Form, Input } from 'components/UI'

const ActivitySearch = ({ searchText, placeholder, updateActivitySearchQuery, ...rest }) => {
  const [value, setValue] = useState()
  useDebounce(updateActivitySearchQuery, value)

  return (
    <Form {...rest}>
      <Input
        border={0}
        field="activity-search"
        highlightOnValid={false}
        id="activity-search"
        initialValue={searchText}
        mr={2}
        onValueChange={setValue}
        placeholder={placeholder}
        type="search"
        variant="thin"
      />
    </Form>
  )
}

ActivitySearch.propTypes = {
  placeholder: PropTypes.string.isRequired,
  searchText: PropTypes.string,
  updateActivitySearchQuery: PropTypes.func.isRequired,
}

export default ActivitySearch
