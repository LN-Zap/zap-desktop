import base, { palette } from './base'

const {
  white,
  black,
  lightningOrange,
  lightningBrown,
  seaGray,
  hoverSeaGray,
  underwaterGray,
  superGreen,
  pineGreen,
  superRed,
  mudBrown,
  gray
} = palette

const colors = {
  primaryText: black,
  lightningOrange,
  lightningBrown,
  superGreen,
  pineGreen,
  superRed,
  mudBrown,
  gray,
  primaryColor: white,
  secondaryColor: underwaterGray,
  tertiaryColor: seaGray,
  highlight: hoverSeaGray
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
  name: 'light',
  ...base,
  colors,
  buttons,
  cards,
  messages
}
