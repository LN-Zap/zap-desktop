import React from 'react'

import { RadioCard } from 'components/Form'
import BackupLocal from 'components/Icon/BackupLocal'
import Dropbox from 'components/Icon/Dropbox'
import GoogleDrive from 'components/Icon/GoogleDrive'

const ICONS = {
  local: { icon: BackupLocal, width: 80, height: 80 },
  dropbox: { icon: Dropbox, width: 120, height: 120 },
  gdrive: { icon: GoogleDrive, width: 110, height: 110 },
}

const BackupTypeItem = props => {
  return <RadioCard icons={ICONS} {...props} />
}

BackupTypeItem.displayName = 'BackupTypeItem'

export default BackupTypeItem
