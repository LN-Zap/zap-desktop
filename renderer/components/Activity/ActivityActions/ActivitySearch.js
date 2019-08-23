import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDebounce } from 'hooks'
import { Form, SearchInput } from 'components/Form'

const ActivitySearch = ({ searchText, placeholder, updateSearchText, ...rest }) => {
  const [value, setValue] = useState()
  useDebounce(updateSearchText, value)

  return (
    <Form {...rest}>
      <SearchInput
        field="activity-search"
        highlightOnValid={false}
        id="activity-search"
        initialValue={searchText}
        mr={2}
        onValueChange={setValue}
        placeholder={placeholder}
        sx={{
          borderWidth: 0,
        }}
        variant="thin"
      />
    </Form>
  )
}

ActivitySearch.propTypes = {
  placeholder: PropTypes.string.isRequired,
  searchText: PropTypes.string,
  updateSearchText: PropTypes.func.isRequired,
}

export default ActivitySearch
