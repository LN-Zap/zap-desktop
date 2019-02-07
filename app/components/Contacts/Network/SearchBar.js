import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import Search from 'components/Icon/Search'
import { Bar, Button, Form, Input, Panel, Text } from 'components/UI'
import X from 'components/Icon/X'

class SearchBar extends React.PureComponent {
  static propTypes = {
    searchQuery: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    onSearchQueryChanged: PropTypes.func.isRequired
  }

  clearSearchQuery = () => {
    this.formApi.setValue('search', '')
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { searchQuery, placeholder, onSearchQueryChanged } = this.props

    return (
      <>
        <Bar mt={3} borderColor="gray" css={{ opacity: 0.3 }} />
        <Panel.Footer as="footer" px={3} py={3}>
          <Form width={1} getApi={this.setFormApi}>
            {({ formState }) => (
              <Flex alignItems="center">
                <Text fontSize="l" css={{ opacity: 0.5 }} mt={2}>
                  <Search />
                </Text>
                <Input
                  field="search"
                  id="search"
                  type="text"
                  variant="thin"
                  border={0}
                  placeholder={placeholder}
                  initialValue={searchQuery}
                  onValueChange={onSearchQueryChanged}
                  width={1}
                />
                {formState.values.search && (
                  <Button
                    variant="secondary"
                    size="small"
                    type="button"
                    onClick={this.clearSearchQuery}
                  >
                    <X />
                  </Button>
                )}
              </Flex>
            )}
          </Form>
        </Panel.Footer>
      </>
    )
  }
}

export default SearchBar
