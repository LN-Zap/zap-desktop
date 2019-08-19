import { tint } from 'polished'
import merge from 'lodash/merge'
import base from '../base'

const createThemeVariant = (name, overrides = {}) => {
  const { colors, ...rest } = overrides

  const buttons = {
    normal: {
      bg: 'tertiaryColor',
      color: 'lightningOrange',
      '&:hover:enabled': {
        bg: 'highlight',
      },
      '&:focus': {
        bg: 'highlight',
      },
    },
    primary: {
      backgroundImage: `linear-gradient(to left,
        ${colors.lightningOrange}, ${tint(0.2, colors.lightningOrange)})`,
      color: 'white',
    },
    secondary: {
      opacity: 0.6,
      '&.active': {
        opacity: 1,
      },
      bg: 'inherit',
      color: 'primaryText',
      '&:hover:enabled': {
        opacity: 1,
      },
      '&:focus': {
        opacity: 1,
      },
    },
    menu: {
      color: 'primaryText',
      bg: 'primaryColor',
      '&.active': {
        color: 'lightningOrange',
        bg: 'highlight',
      },
      '&:hover:enabled': {
        bg: 'highlight',
      },
      '&:focus': {
        bg: 'highlight',
      },
    },
    danger: {
      bg: 'superRed',
      color: 'white',
    },
  }

  const variants = {
    message: {
      success: {
        color: 'superGreen',
      },
      warning: {
        color: 'lightningOrange',
      },
      error: {
        color: 'superRed',
      },
      processing: {
        color: 'ightningOrange',
      },
    },

    notification: {
      success: {
        bg: 'mutedGreen',
        color: 'superGreen',
      },
      warning: {
        bg: 'mutedOrange',
        color: 'lightningOrange',
      },
      error: {
        bg: 'mutedRed',
        color: 'superRed',
      },
    },

    bar: {
      normal: {
        opacity: 0.6,
      },
      light: {
        opacity: 0.3,
      },
    },

    statuses: {
      online: {
        color: 'superGreen',
      },
      pending: {
        color: 'lightningOrange',
      },
      closing: {
        color: 'superRed',
      },
      offline: {
        color: 'gray',
      },
    },
  }

  const theme = {
    name,
    ...base,
    colors,
    buttons,
    variants,
  }

  return merge({}, theme, rest)
}

export default createThemeVariant
