import React from 'react'
import styled from 'styled-components'
import { asField } from 'informed'
import { Flex } from 'rebass'

import WithOpenDialog from 'components/withOpenDialog'
import { Input, OpenDialogButton } from 'components/UI'

const InnerInput = styled(Input)`
  input {
    padding-right: 50px;
  }
`

const OpenDialogInput = asField(props => {
  return (
    <WithOpenDialog
      render={({ openDialog }) => (
        <Flex mb={3} flexDirection="row" alignItems="center">
          <InnerInput width={1} {...props} />
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
        </Flex>
      )}
    />
  )
})

export default OpenDialogInput
