import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import Search from 'components/Icon/Search'
import { Bar, Form, Input, Panel, Text } from 'components/UI'

const SearchBar = ({ searchQuery, placeholder, onSearchQueryChanged }) => (
  <>
    <Bar mt={3} borderColor="gray" css={{ opacity: 0.3 }} />
    <Panel.Footer as="footer" px={3} py={3}>
      <Flex alignItems="center" width={1}>
        <Text fontSize="l" css={{ opacity: 0.5 }} mt={2}>
          {!searchQuery && <Search />}
        </Text>
        <Form width={1}>
          <Input
            field="search"
            id="search"
            type="text"
            variant="thin"
            border={0}
            placeholder={placeholder}
            value={searchQuery}
            onChange={onSearchQueryChanged}
          />
        </Form>
      </Flex>
    </Panel.Footer>
  </>
)

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onSearchQueryChanged: PropTypes.func.isRequired
}

export default SearchBar
