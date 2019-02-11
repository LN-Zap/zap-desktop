import React from 'react'
import PropTypes from 'prop-types'
import * as yup from 'yup'

/**
 * A HOC that will add validation of a `required` property to a field.
 * @param {React.Component} Component Component to wrap
 */
const withRequiredValidation = Component =>
  class extends React.Component {
    static displayName = 'withRequiredValidation'

    static propTypes = {
      disabled: PropTypes.bool,
      required: PropTypes.bool,
      validate: PropTypes.func
    }

    static defaultProps = {
      disabled: false,
      required: false
    }

    validate = value => {
      const { disabled, required } = this.props
      if (disabled) {
        return
      }
      try {
        if (required) {
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
      return <Component validate={this.validate} {...this.props} />
    }
  }

export default withRequiredValidation
