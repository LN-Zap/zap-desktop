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
  superOrange: '#fd9800',
  mudBrown: '#330d0d',
  gray: '#959595',
  darkGray: '#050f19',
  lightGray: '#e7e7e7',
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
  small: 1,
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
    fontFamily: 'sans',
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
    fontFamily: 'sans',
    bg: 'primaryAccent',
    color: 'white',
  },

  secondary: {
    fontFamily: 'sans',
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
    fontFamily: 'sans',
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
    fontFamily: 'sans',
    bg: 'superRed',
    color: 'white',
  },
}

const inputStyles = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'gray',
  borderRadius: 's',
  bg: 'transparent',
  color: 'primaryText',
  fontFamily: 'sans',
  fontSize: 'm',
  fontWeight: 'light',
  width: '100%',
  outline: 'none',
  cursor: 'text',
  position: 'relative',
  '::-webkit-search-decoration:hover, ::-webkit-search-cancel-button:hover': {
    cursor: 'pointer',
  },
  '::placeholder': {
    color: 'gray',
  },
  '&:disabled': {
    bg: `${palette.gray}33`,
    opacity: 0.6,
  },
  '&:read-only': {
    opacity: 0.6,
  },
}

const forms = {
  input: {
    normal: {
      ...inputStyles,
      lineHeight: 'small',
      px: 3,
      height: 48,
    },
    thin: {
      ...inputStyles,
      lineHeight: 'small',
      px: 2,
      height: 34,
    },
  },

  textarea: {
    ...inputStyles,
    p: 3,
    lineHeight: 'normal',
  },

  label: {
    color: 'primaryText',
    fontWeight: 'normal',
    width: 'auto',
  },
}

const variants = {
  message: {
    success: {
      color: 'superGreen',
    },
    warning: {
      color: 'superOrange',
    },
    error: {
      color: 'superRed',
    },
    processing: {
      color: 'superOrange',
    },
  },

  notification: {
    success: {
      bg: 'mutedGreen',
      color: 'superGreen',
    },
    warning: {
      bg: 'mutedOrange',
      color: 'superOrange',
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
      color: 'superOrange',
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
  forms,
  variants,
}
