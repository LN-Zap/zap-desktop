import React from 'react'
import styled, { withTheme } from 'styled-components'
import { Card } from 'rebass'
import QRCode from 'qrcode.react'

const Container = styled(Card)`
  position: relative;
  width: ${props => props.size};
  height: ${props => props.size};
  display: inline-block;
`
const CropWrapper = styled(Card)`
  position: relative;
  width: ${props => props.size};
  height: ${props => props.size};
`
const TopLeft = styled(Card)`
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: ${props => props.size};
  height: ${props => props.size};
  clip-path: polygon(0 0, 25% 0, 25% 25%, 0 25%);
`
const TopRight = styled(Card)`
  position: absolute;
  top: 0;
  right: 0;
  display: inline-block;
  width: ${props => props.size};
  height: ${props => props.size};
  clip-path: polygon(75% 0, 100% 0%, 100% 25%, 75% 25%);
`
const BottomLeft = styled(Card)`
  position: absolute;
  bottom: 0;
  left: 0;
  display: inline-block;
  width: ${props => props.size};
  height: ${props => props.size};
  clip-path: polygon(0 75%, 25% 75%, 25% 100%, 0 100%);
`
const BottomRight = styled(Card)`
  position: absolute;
  bottom: 0;
  right: 0;
  display: inline-block;
  width: ${props => props.size};
  height: ${props => props.size};
  clip-path: polygon(75% 75%, 100% 75%, 100% 100%, 75% 100%);
`
const Code = styled(QRCode)`
  border-style: solid;
  border-color: white;
  border-width: 4px;
  position: absolute;
  top: 10%;
  left: 10%;
`

/**
 * @render react
 * @name QRCode
 * @example
 * <QRCode value="103456789" />
 */
class ZapQRCode extends React.PureComponent {
  static displayName = 'QRCode'

  static defaultProps = {
    size: '150px',
    color: 'darkestBackground',
    bg: 'primaryText'
  }

  render() {
    const { bg, color, size, theme } = this.props
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
          size="80%"
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
