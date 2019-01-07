import React from 'react'
import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import { Card } from 'rebass'
import QRCode from 'qrcode.react'

const Container = styled(Card)`
  position: relative;
  width: ${props => props.size * 1.2}px;
  height: ${props => props.size * 1.2}px;
  display: inline-block;
`
const CropWrapper = styled(Card)`
  position: relative;
  width: ${props => props.size * 1.2}px;
  height: ${props => props.size * 1.2}px;
`
const TopLeft = styled(Card)`
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: ${props => props.size * 1.2}px;
  height: ${props => props.size * 1.2}px;
  clip-path: polygon(0 0, 25% 0, 25% 25%, 0 25%);
`
const TopRight = styled(Card)`
  position: absolute;
  top: 0;
  right: 0;
  display: inline-block;
  width: ${props => props.size * 1.2}px;
  height: ${props => props.size * 1.2}px;
  clip-path: polygon(75% 0, 100% 0%, 100% 25%, 75% 25%);
`
const BottomLeft = styled(Card)`
  position: absolute;
  bottom: 0;
  left: 0;
  display: inline-block;
  width: ${props => props.size * 1.2}px;
  height: ${props => props.size * 1.2}px;
  clip-path: polygon(0 75%, 25% 75%, 25% 100%, 0 100%);
`
const BottomRight = styled(Card)`
  position: absolute;
  bottom: 0;
  right: 0;
  display: inline-block;
  width: ${props => props.size * 1.2}px;
  height: ${props => props.size * 1.2}px;
  clip-path: polygon(75% 75%, 100% 75%, 100% 100%, 75% 100%);
`
const Code = styled(QRCode)`
  border-style: solid;
  border-color: white;
  border-width: 8px;
  position: absolute;
  top: calc(10% - 2px);
  left: calc(10% - 2px);
`

/**
 * @render react
 * @name QRCode
 * @example
 * <QRCode value="103456789" />
 */
class ZapQRCode extends React.PureComponent {
  static displayName = 'QRCode'

  static propTypes = {
    size: PropTypes.string,
    color: PropTypes.string,
    bg: PropTypes.string,
    theme: PropTypes.object.isRequired
  }

  static defaultProps = {
    size: 'medium',
    color: 'black',
    bg: 'white'
  }

  render() {
    let { bg, color, size, theme } = this.props

    if (size === 'small') {
      size = 120
    }
    if (size === 'medium') {
      size = 150
    }
    if (size === 'large') {
      size = 180
    }

    return (
      <Container size={size}>
        <CropWrapper size={size}>
          <TopLeft size={size} border={1} borderRadius="10%" borderColor="lightningOrange" />
          <TopRight size={size} border={1} borderRadius="10%" borderColor="lightningOrange" />
          <BottomLeft size={size} border={1} borderRadius="10%" borderColor="lightningOrange" />
          <BottomRight size={size} border={1} borderRadius="10%" borderColor="lightningOrange" />
        </CropWrapper>
        <Code
          {...this.props}
          size={size}
          renderAs="svg"
          fgColor={(theme && theme.colors[color]) || color}
          bgColor={(theme && theme.colors[bg]) || bg}
          level="L"
        />
      </Container>
    )
  }
}

export default withTheme(ZapQRCode)
