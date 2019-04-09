import React from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { asField } from 'informed'
import { withRequiredValidation } from 'hocs'
import PropTypes from 'prop-types'
import { WithOpenDialog } from 'hocs'
import { BasicInput } from './Input'
import OpenDialogButton from './OpenDialogButton'

const InnerInput = styled(BasicInput)`
  input {
    padding-right: 50px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const OpenDialogInput = props => {
  return (
    <WithOpenDialog
      render={({ openDialog }) => (
        <InnerInput width={1} {...props}>
          <OpenDialogButton
            onClick={() => {
              const result = openDialog()
              //set value only if something was selected to avoid
              //overriding an existing state
              if (result) {
                props.fieldApi.setValue(result)
              }
            }}
          />
        </InnerInput>
      )}
    />
  )
}

OpenDialogInput.propTypes = {
  fieldApi: PropTypes.object.isRequired,
}

export { OpenDialogInput as BasicOpenDialogInput }

export default compose(
  withRequiredValidation,
  asField
)(OpenDialogInput)
