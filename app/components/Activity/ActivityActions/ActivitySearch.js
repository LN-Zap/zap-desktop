import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDebounce } from 'components/Util/hooks'
import { Form, Input } from 'components/UI'

const ActivitySearch = ({ searchQuery, placeholder, updateActivitySearchQuery, ...rest }) => {
  const [value, setValue] = useState()
  useDebounce(updateActivitySearchQuery, value)

  return (
    <Form {...rest}>
      <Input
        field="activity-search"
        id="activity-search"
        type="search"
        placeholder={placeholder}
        initialValue={searchQuery}
        onValueChange={setValue}
        highlightOnValid={false}
        mr={2}
      />
    </Form>
  )
}

ActivitySearch.propTypes = {
  searchQuery: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  updateActivitySearchQuery: PropTypes.func.isRequired
}

export default ActivitySearch
