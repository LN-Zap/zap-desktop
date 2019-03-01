import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { Form, Input } from 'components/UI'

export default class ActivitySearch extends React.PureComponent {
  static propTypes = {
    searchQuery: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    updateActivitySearchQuery: PropTypes.func.isRequired
  }

  /*eslint-disable react/destructuring-assignment*/
  debouncedUpdateActivitySearchQuery = debounce(this.props.updateActivitySearchQuery, 300)

  render() {
    const { searchQuery, placeholder, updateActivitySearchQuery, ...rest } = this.props

    return (
      <Form {...rest}>
        <Input
          field="activity-search"
          id="activity-search"
          type="search"
          placeholder={placeholder}
          initialValue={searchQuery}
          onValueChange={this.debouncedUpdateActivitySearchQuery}
          highlightOnValid={false}
          mr={2}
        />
      </Form>
    )
  }
}
