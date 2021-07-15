import React, { useRef } from 'react'

import { Form as InformedForm } from 'informed'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space, layout, color, compose } from 'styled-system'

// Create an html input element that accepts all style props from styled-system.
const FormInner = styled(InformedForm)(compose(space, layout, color))

const Form = ({ asyncValidators, onSubmit, onSubmitFailure, getApi, ...rest }) => {
  const formApi = useRef(null)

  const onBeforeSubmit = async values => {
    // pause submit if we have async validators set
    if (asyncValidators && asyncValidators.length) {
      await Promise.all(asyncValidators.map(v => v()))
    }

    const api = formApi.current
    if (api) {
      if (api.getState().invalid) {
        onSubmitFailure && onSubmitFailure()
      } else {
        onSubmit && onSubmit(values)
      }
    }
  }

  const getApiWrapper = api => {
    formApi.current = api
    getApi && getApi(api)
  }

  return (
    <FormInner
      {...rest}
      getApi={getApiWrapper}
      noValidate
      onSubmit={onBeforeSubmit}
      onSubmitFailure={onSubmitFailure}
    />
  )
}

Form.propTypes = {
  asyncValidators: PropTypes.array,
  getApi: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitFailure: PropTypes.func,
}

export default Form
