import { createIntl, createIntlCache } from 'react-intl'

import messages from '@zap/translations/en.json'
// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache()
const intl = createIntl(
  {
    locale: 'en',
    messages,
  },
  cache
)

export default intl
