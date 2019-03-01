import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { Form, Input } from 'components/UI'

const ActivitySearch = ({ searchQuery, placeholder, updateActivitySearchQuery, ...rest }) => {
  const debouncedUpdateActivitySearchQuery = debounce(updateActivitySearchQuery, 300)

  return (
    <Form {...rest}>
      <Input
        field="activity-search"
        id="activity-search"
        type="search"
        placeholder={placeholder}
        initialValue={searchQuery}
        onValueChange={debouncedUpdateActivitySearchQuery}
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
