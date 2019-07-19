import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'components/UI'

const ChannelSearch = ({ searchQuery, placeholder, updateChannelSearchQuery, ...rest }) => {
  const formApi = useRef(null)
  const fieldId = 'channel-search'
  const { current } = formApi
  useEffect(() => {
    // update input value if searchQuery has changed externally
    if (current) {
      current.setValue(fieldId, searchQuery)
    }
  }, [current, searchQuery])

  return (
    <Form
      {...rest}
      getApi={api => {
        formApi.current = api
      }}
    >
      <Input
        border={0}
        field={fieldId}
        highlightOnValid={false}
        id={fieldId}
        initialValue={searchQuery}
        mr={2}
        onValueChange={updateChannelSearchQuery}
        placeholder={placeholder}
        type="search"
        variant="thin"
      />
    </Form>
  )
}

ChannelSearch.propTypes = {
  placeholder: PropTypes.string.isRequired,
  searchQuery: PropTypes.string,
  updateChannelSearchQuery: PropTypes.func.isRequired,
}

export default ChannelSearch
