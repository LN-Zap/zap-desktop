import React from 'react'

import { RadioCard } from 'components/Form'
import ConnectOnboarding from 'components/Icon/ConnectOnboarding'
import ImportOnboarding from 'components/Icon/ImportOnboarding'
import PlusOnboarding from 'components/Icon/PlusOnboarding'

const ICONS = {
  create: { icon: PlusOnboarding, width: 80, height: 80 },
  custom: { icon: ConnectOnboarding, width: 80, height: 80 },
  import: { icon: ImportOnboarding, width: 80, height: 80 },
}

const ConnectionTypeItem = props => {
  return <RadioCard icons={ICONS} {...props} />
}

ConnectionTypeItem.displayName = 'ConnectionTypeItem'

export default ConnectionTypeItem
