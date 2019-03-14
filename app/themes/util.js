import { tint } from 'polished'
import base from './base'

const createThemeVariant = (name, colors) => {
  const buttons = {
    normal: {
      backgroundColor: colors.tertiaryColor,
      color: colors.lightningOrange,
      '&:hover:enabled': {
        backgroundColor: colors.highlight,
      },
      '&:focus': {
        backgroundColor: colors.highlight,
      },
    },
    primary: {
      backgroundImage: `linear-gradient(to left,
        ${colors.superBlue}, ${tint(0.2, colors.lightningOrange)})`,
      color: colors.white,
    },
    secondary: {
      opacity: 0.6,
      '&.active': {
        opacity: 1,
      },
      backgroundColor: 'transparent',
      color: colors.primaryText,
      '&:hover:enabled': {
        opacity: 1,
      },
      '&:focus': {
        opacity: 1,
      },
    },
    danger: {
      backgroundColor: colors.superRed,
      color: colors.white,
    },
  }

  const cards = {
    success: {
      backgroundColor: colors.pineGreen,
      color: colors.superGreen,
    },
    warning: {
      backgroundColor: colors.lightningBrown,
      color: colors.lightningOrange,
    },
    error: {
      backgroundColor: colors.mudBrown,
      color: colors.superRed,
    },
  }

  const messages = {
    success: {
      color: colors.superGreen,
    },
    warning: {
      color: colors.lightningOrange,
    },
    error: {
      color: colors.superRed,
    },
    processing: {
      color: colors.lightningOrange,
    },
  }

  return {
    name,
    ...base,
    colors,
    buttons,
    cards,
    messages,
  }
}

export default createThemeVariant
