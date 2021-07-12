import { palette } from '../base'
import { createThemeVariant } from '../util'

const customiseTheme = theme => {
  return createThemeVariant('autopay', {
    colors: {
      ...theme.colors,
      primaryAccent: palette.superBlue,
    },
  })
}

export default customiseTheme
