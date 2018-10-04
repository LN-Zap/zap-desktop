import base from './base'

const colors = {
  white: '#fff',
  black: '#000',
  gray: '#959595',
  invisibleGray: '#555',
  lightningOrange: '#fd9800',
  superGreen: '#39e673',
  superRed: '#e63939',
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

export default {
  name: 'dark',
  ...base,
  colors,
  buttons
}
