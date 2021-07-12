import React from 'react'

import { List } from 'react-virtualized'
import styled from 'styled-components'
import { space } from 'styled-system'

const ROW_HEIGHT = 53

const StyledList = styled(List)`
  ${space}
  outline: none;
  padding-left: 12px;
`

const ActivityList = React.forwardRef((props, ref) => (
  <StyledList pr={4} ref={ref} rowHeight={ROW_HEIGHT} {...props} />
))

ActivityList.displayName = 'ActivityList'

export default ActivityList
