import React from 'react'
import { RadioCard } from 'components/UI'

import ConnectOnboarding from 'components/Icon/ConnectOnboarding'
import ImportOnboarding from 'components/Icon/ImportOnboarding'
import PlusOnboarding from 'components/Icon/PlusOnboarding'

const ICONS = {
  create: PlusOnboarding,
  custom: ConnectOnboarding,
  import: ImportOnboarding,
}

const ConnectionTypeItem = props => {
  return <RadioCard icons={ICONS} {...props} />
}

ConnectionTypeItem.displayName = 'ConnectionTypeItem'

export default ConnectionTypeItem
