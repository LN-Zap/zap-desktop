export const space = [0, 4, 8, 16, 32, 45, 72, 108]

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
fontSizes[0] = fontSizes['xxs']
fontSizes[1] = fontSizes['xs']
fontSizes[2] = fontSizes['s']
fontSizes[3] = fontSizes['m']
fontSizes[4] = fontSizes['l']
fontSizes[5] = fontSizes['xl']
fontSizes[6] = fontSizes['xxl']
fontSizes[7] = fontSizes['xxxl']

export const fontWeights = {
  light: 300,
  normal: 400,
}

export const fonts = {
  0: 'Roboto, system-ui, sans-serif',
  sans: 'Roboto, system-ui, sans-serif',
}

export const letterSpacings = {
  normal: 'normal',
  caps: '0.025em',
}

const statuses = {
  online: {
    color: palette.superGreen,
  },
  pending: {
    color: palette.lightningOrange,
  },
  closing: {
    color: palette.superRed,
  },
  offline: {
    color: palette.gray,
  },
}

const bars = {
  normal: {
    opacity: 0.6,
  },
  light: {
    opacity: 0.3,
  },
}

export default {
  space,
  fontSizes,
  fontWeights,
  fonts,
  letterSpacings,
  palette,
  statuses,
  bars,
}
