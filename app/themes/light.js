import base from './base'

const colors = {
  white: '#fff',
  black: '#000',
  gray: '#959595',
  invisibleGray: '#555',
  lightningOrange: '#fd9800',
  superGreen: '#39e673',
  superRed: '#e63939',
  darkestBackground: '#fff',
  lightBackground: '#ebebeb',
  lightestBackground: '#f3f3f3',
  primaryText: '#000',
  gradient: 'linear-gradient(270deg, #fd9800 0%, #ffbd59 100%)'
}

const buttons = {
  normal: {
    backgroundColor: colors.lightBackground,
    color: colors.lightningOrange,
    '&:hover:enabled': {
      backgroundColor: colors.lightestBackground
    }
  },
  primary: {
    backgroundColor: colors.lightningOrange,
    color: colors.white
  }
}

export default {
  name: 'light',
  ...base,
  colors,
  buttons
}
