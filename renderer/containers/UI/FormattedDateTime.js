import React from 'react'

import PropTypes from 'prop-types'
import { FormattedDate, FormattedTime } from 'react-intl'
import { connect } from 'react-redux'

import { settingsSelectors } from 'reducers/settings'

const mapStateToProps = state => ({
  timeDisplayMode: settingsSelectors.currentConfig(state).timeDisplayMode,
})

const FormattedDateTime = ({ timeDisplayMode = '12hour', format, month = 'long', value }) => {
  const is12Hour = timeDisplayMode === '12hour'

  switch (format) {
    case 'date':
      return <FormattedDate day="2-digit" month={month} value={value} year="numeric" />
    case 'time':
      return <FormattedTime hour12={is12Hour} value={value} />
    default:
      return (
        <FormattedDate
          day="2-digit"
          hour="numeric"
          hour12={is12Hour}
          minute="numeric"
          month={month}
          value={value}
          year="numeric"
        />
      )
  }
}

FormattedDateTime.propTypes = {
  format: PropTypes.oneOf(['date', 'time']),
  month: PropTypes.string,
  timeDisplayMode: PropTypes.oneOf(['12hour', '24hour']),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
}

export default connect(mapStateToProps)(FormattedDateTime)
