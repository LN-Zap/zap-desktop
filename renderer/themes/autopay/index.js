import { createThemeVariant } from '../util'
import { palette } from '../base'

const customiseTheme = theme => {
  return createThemeVariant('autopay', {
    colors: {
      ...theme.colors,
      primaryAccent: palette.superBlue,
    },
  })
}

export default customiseTheme
