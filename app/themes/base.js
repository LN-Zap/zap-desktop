export const space = [0, 4, 8, 16, 32, 45, 72, 108]

export const palette = {
  white: '#ffffff',
  black: '#000',
  gray: '#959595',
  lightningOrange: '#fd9800',
  lightningBrown: '#4a2c00',
  deepseaBlue: '#242633',
  seaBlue: '#313340',
  underwaterBlue: '#353745',
  superGreen: '#39e673',
  pineGreen: '#0d331a',
  superRed: '#e63939',
  mudBrown: '#330d0d'
}

export const fontSizes = {
  xxs: '8px',
  xs: '10px',
  s: '11px',
  m: '13px',
  l: '15px',
  xl: '18px',
  xxl: '30px',
  xxxl: '60px'
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
  normal: 400
}

export const fonts = {
  0: 'Roboto, system-ui, sans-serif',
  sans: 'Roboto, system-ui, sans-serif'
}

export const letterSpacings = {
  normal: 'normal',
  caps: '0.025em'
}

export default {
  space,
  fontSizes,
  fontWeights,
  fonts,
  letterSpacings,
  palette
}
