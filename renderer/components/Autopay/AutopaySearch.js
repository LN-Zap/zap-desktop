import React from 'react'

import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

import { intlShape } from '@zap/i18n'
import { Form, SearchInput } from 'components/Form'

import messages from './messages'

const AutopaySearch = ({ intl, searchQuery, updateAutopaySearchQuery, ...rest }) => (
  <Form width={1} {...rest}>
    <SearchInput
      field="channel-search"
      highlightOnValid={false}
      id="channel-search"
      initialValue={searchQuery}
      onValueChange={updateAutopaySearchQuery}
      placeholder={intl.formatMessage({ ...messages.search_placeholder })}
    />
  </Form>
)

AutopaySearch.propTypes = {
  intl: intlShape.isRequired,
  searchQuery: PropTypes.string,
  updateAutopaySearchQuery: PropTypes.func.isRequired,
}

export default injectIntl(AutopaySearch)
