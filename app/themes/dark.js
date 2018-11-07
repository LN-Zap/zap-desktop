import base, { palette } from './base'

const {
  white,
  lightningOrange,
  lightningBrown,
  deepseaBlue,
  seaBlue,
  hoverSeaBlue,
  underwaterBlue,
  superGreen,
  pineGreen,
  superRed,
  mudBrown,
  gray
} = palette

const colors = {
  primaryText: white,
  lightningOrange,
  lightningBrown,
  superGreen,
  pineGreen,
  superRed,
  mudBrown,
  gray,
  primaryColor: deepseaBlue,
  secondaryColor: underwaterBlue,
  tertiaryColor: seaBlue,
  highlight: hoverSeaBlue
}

const buttons = {
  normal: {
    backgroundColor: colors.tertiaryColor,
    color: colors.lightningOrange,
    '&:hover:enabled': {
      backgroundColor: colors.highlight
    },
    '&:focus': {
      backgroundColor: colors.highlight
    }
  },
  primary: {
    backgroundColor: colors.lightningOrange,
    color: colors.white
  },
  secondary: {
    opacity: 0.6,
    backgroundColor: 'transparent',
    color: colors.primaryText,
    '&:hover:enabled': {
      opacity: 1
    },
    '&:focus': {
      opacity: 1
    }
  }
}
const cards = {
  success: {
    backgroundColor: colors.pineGreen,
    color: colors.superGreen
  },
  warning: {
    backgroundColor: colors.lightningBrown,
    color: colors.lightningOrange
  },
  error: {
    backgroundColor: colors.mudBrown,
    color: colors.superRed
  }
}
const messages = {
  success: {
    color: colors.superGreen
  },
  warning: {
    color: colors.lightningOrange
  },
  error: {
    color: colors.superRed
  }
}

export default {
  name: 'dark',
  ...base,
  colors,
  buttons,
  cards,
  messages
}
