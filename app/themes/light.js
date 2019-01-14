import base, { palette } from './base'

const {
  white,
  black,
  lightningOrange,
  lightOrange,
  seaGray,
  hoverSeaGray,
  underwaterGray,
  superGreen,
  lightGreen,
  superRed,
  lightRed,
  gray
} = palette

const colors = {
  primaryColor: white,
  secondaryColor: underwaterGray,
  tertiaryColor: seaGray,
  highlight: hoverSeaGray,
  primaryText: black,
  lightningOrange,
  lightOrange,
  superGreen,
  lightGreen,
  superRed,
  lightRed,
  gray
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
    '&.active': {
      opacity: 1
    },
    backgroundColor: 'transparent',
    color: colors.primaryText,
    '&:hover:enabled': {
      opacity: 1
    },
    '&:focus': {
      opacity: 1
    }
  },
  danger: {
    backgroundColor: colors.superRed,
    color: colors.white
  }
}
const cards = {
  success: {
    backgroundColor: colors.lightGreen,
    color: colors.superGreen
  },
  warning: {
    backgroundColor: colors.lightOrange,
    color: colors.lightningOrange
  },
  error: {
    backgroundColor: colors.lightRed,
    color: colors.superRed
  },
  processing: {
    color: colors.lightningOrange
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
