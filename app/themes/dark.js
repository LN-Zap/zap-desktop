import base, { palette } from './base'

const colors = {
  ...palette,
  invisibleGray: '#555',
  darkestBackground: '#242633',
  lightBackground: '#313340',
  lightestBackground: '#373947',
  highlight: '#353745',
  primaryText: '#fff',
  gradient: 'linear-gradient(270deg, #868b9f 0%, #333c5e 100%)'
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
  name: 'dark',
  ...base,
  colors,
  buttons,
  cards
}
