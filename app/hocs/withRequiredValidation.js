import React from 'react'
import PropTypes from 'prop-types'
import * as yup from 'yup'
import getDisplayName from '@zap/utils/getDisplayName'

/**
 * A HOC that will add validation of a `required` property to a field.
 * @param {React.Component} Component Component to wrap
 */
const withRequiredValidation = Component =>
  class extends React.Component {
    static displayName = `WithRequiredValidation(${getDisplayName(Component)})`

    static propTypes = {
      isDisabled: PropTypes.bool,
      isRequired: PropTypes.bool,
      validate: PropTypes.func,
    }

    static defaultProps = {
      isDisabled: false,
      isRequired: false,
    }

    validate = value => {
      const { isDisabled, isRequired } = this.props
      if (isDisabled) {
        return
      }
      try {
        if (isRequired) {
          const validator = yup.string().required()
          validator.validateSync(value)
        }
      } catch (error) {
        return error.message
      }

      // Run any additional validation provided by the caller.
      const { validate } = this.props
      if (validate) {
        return validate(value)
      }
    }

    render() {
      return <Component {...this.props} validate={this.validate} />
    }
  }

export default withRequiredValidation
