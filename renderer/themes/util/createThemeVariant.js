import merge from 'lodash/merge'

import base from '../base'

const createThemeVariant = (name, overrides = {}) => {
  const { colors, ...rest } = overrides

  const theme = {
    name,
    ...base,
    colors,
  }

  return merge({}, theme, rest)
}

export default createThemeVariant
