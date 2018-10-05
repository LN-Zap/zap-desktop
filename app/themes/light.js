import base, { palette } from './base'

const colors = {
  ...palette,
  invisibleGray: '#555',
  darkestBackground: '#fff',
  lightBackground: '#ebebeb',
  lightestBackground: '#f3f3f3',
  highlight: '#f6f6f6',
  primaryText: '#000',
  gradient: 'linear-gradient(270deg, #fd9800 0%, #ffbd59 100%)'
}

const buttons = {
  normal: {
    backgroundColor: colors.lightBackground,
    color: colors.lightningOrange,
    '&:hover:enabled': {
      backgroundColor: colors.highlight
    }
  },
  primary: {
    backgroundColor: colors.lightningOrange,
    color: colors.white
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

export default {
  name: 'light',
  ...base,
  colors,
  buttons,
  cards
}
