import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Form, Label, Select } from 'components/UI'
import messages from './messages'

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
      <Flex alignItems="center">
        <Label fontWeight="light" htmlFor="channel-sort" mr={2}>
          <FormattedMessage {...messages.channel_sort_label} />
        </Label>
        <Select
          field="channel-sort"
          fontWeight="normal"
          highlightOnValid={false}
          id="channel-filter"
          initialSelectedItem={sort}
          items={items}
          onValueSelected={changeSort}
        />
      </Flex>
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
