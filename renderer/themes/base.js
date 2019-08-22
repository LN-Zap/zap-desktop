/**
 * @file Defines core theme elements shared across all themes.
 * These items can be overriden on a per theme basis.
 */

/**
 * Colour palette
 *
 * The color palette defines all colors users across all themes and is not used directly in any of the themes.
 * When creating a theme you should references colors from the color palette directy.
 * New colors should be added here.
 *
 * @type {object}
 */
export const palette = {
  white: '#ffffff',
  black: '#000000',
  lightningOrange: '#fd9800',
  lightningBrown: '#4a2c00',
  deepseaBlue: '#242633',
  seaBlue: '#313340',
  hoverSeaBlue: '#353745',
  underwaterBlue: '#373947',
  seaGray: '#f3f3f3',
  hoverSeaGray: '#f2f2f2',
  underwaterGray: '#ebebeb',
  superGreen: '#39e673',
  pineGreen: '#0d331a',
  superRed: '#e63939',
  superBlue: '#005dfc',
  mudBrown: '#330d0d',
  gray: '#959595',
  lightGreen: '#eefff4',
  lightOrange: '#fff3e1',
  lightRed: '#ffeded',
}

export const space = [0, 4, 8, 16, 32, 45, 72, 108]

export const shadows = {
  xs: '0 2px 3px 0 rgba(0, 0, 0, 0.3)',
  s: '0 2px 4px 0 rgba(0, 0, 0, 0.4)',
  m: '0 2px 24px 0 rgba(0, 0, 0, 0.5)',
  l: '0 20px 70px 0 rgba(0, 0, 0, 0.6)',
}

export const radii = {
  s: '5px',
  m: '8px',
  l: '14px',
  xl: '40px',
}

export const fontSizes = {
  xxs: '8px',
  xs: '10px',
  s: '11px',
  m: '13px',
  l: '15px',
  xl: '18px',
  xxl: '30px',
  xxxl: '60px',
}

export const fontWeights = {
  heading: 300,
  light: 300,
  normal: 400,
}

export const lineHeights = {
  normal: 1.4,
  heading: 1.4,
}

export const fonts = {
  0: 'Roboto, system-ui, sans-serif',
  sans: 'Roboto, system-ui, sans-serif',
  heading: 'Roboto, system-ui, sans-serif',
}

export const letterSpacings = {
  normal: 'normal',
  caps: '0.025em',
}

const buttons = {
  normal: {
    bg: 'tertiaryColor',
    color: 'primaryAccent',
    '&:hover:enabled': {
      bg: 'highlight',
    },
    '&:focus': {
      bg: 'highlight',
    },
  },

  primary: {
    bg: 'primaryAccent',
    color: 'white',
  },

  secondary: {
    bg: 'inherit',
    color: 'primaryText',
    '&:hover:enabled': {
      opacity: 1,
    },
    opacity: 0.6,
    '&.active': {
      opacity: 1,
    },
    '&:focus': {
      opacity: 1,
    },
  },

  menu: {
    bg: 'primaryColor',
    color: 'primaryText',
    '&.active': {
      color: 'primaryAccent',
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
      color: 'primaryAccent',
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
      color: 'primaryAccent',
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
      color: 'primaryAccent',
    },
    closing: {
      color: 'superRed',
    },
    offline: {
      color: 'gray',
    },
  },
}

export default {
  radii,
  space,
  fontSizes,
  fontWeights,
  fonts,
  letterSpacings,
  lineHeights,
  palette,
  shadows,
  buttons,
  variants,
}
