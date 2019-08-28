import React from 'react'
import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import { Box, Card } from 'rebass/styled-components'
import QRCode from 'qrcode.react'

const QRCODE_SIZE_SMALL = 'small'
const QRCODE_SIZE_MEDIUM = 'medium'
const QRCODE_SIZE_LARGE = 'large'
const QRCODE_SIZE_XLARGE = 'xlarge'
const QRCODE_SIZE_XXLARGE = 'xxlarge'

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

const CornerCard = styled(Card)`
  display: inline-block;
  width: ${props => props.size * 1.2}px;
  height: ${props => props.size * 1.2}px;
  border: ${({ border }) => border}px solid ${({ theme, borderColor }) => theme.colors[borderColor]};
  border-radius: 10%;
`
const TopLeft = styled(CornerCard)`
  position: absolute;
  top: 0;
  left: 0;
  clip-path: polygon(0 0, 25% 0, 25% 25%, 0 25%);
`
const TopRight = styled(CornerCard)`
  position: absolute;
  top: 0;
  right: 0;
  clip-path: polygon(75% 0, 100% 0%, 100% 25%, 75% 25%);
`
const BottomLeft = styled(CornerCard)`
  position: absolute;
  bottom: 0;
  left: 0;
  clip-path: polygon(0 75%, 25% 75%, 25% 100%, 0 100%);
`
const BottomRight = styled(CornerCard)`
  position: absolute;
  bottom: 0;
  right: 0;
  clip-path: polygon(75% 75%, 100% 75%, 100% 100%, 75% 100%);
`
const CodeWrapper = styled(Box)`
  border-style: solid;
  border-color: white;
  display: inline-flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: ${props => (props.isObfuscated ? 'blur(3px)' : 'none')};
  transition: ${props => (props.isObfuscated ? 'none' : 'all 0.5s ease')};
`
const Mask = styled(Box)`
  background-color: white;
  border-style: solid;
  border-color: white;
  position: absolute;
  top: calc(25% - 2px);
  left: calc(25% - 2px);
  filter: blur(4px);
  width: 50%;
  height: 50%;
  opacity: ${props => (props.isObfuscated ? 100 : 0)};
  transition: ${props => (props.isObfuscated ? 'none' : 'all 0.5s ease')};
`
const Code = styled(QRCode)`
  border-style: solid;
  border-color: white;
  border-width: 8px;
`

/**
 * @name QRCode
 * @example
 * <QRCode value="103456789" />
 */
class ZapQRCode extends React.PureComponent {
  static displayName = 'QRCode'

  static propTypes = {
    bg: PropTypes.string,
    border: PropTypes.number,
    color: PropTypes.string,
    isObfuscated: PropTypes.bool,
    size: PropTypes.string,
    theme: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    size: QRCODE_SIZE_MEDIUM,
    color: 'black',
    bg: 'white',
    border: 1,
  }

  render() {
    let { bg, color, size, border, isObfuscated, theme, value, ...rest } = this.props

    switch (size) {
      case QRCODE_SIZE_SMALL:
        size = 120
        break
      case QRCODE_SIZE_MEDIUM:
        size = 150
        break
      case QRCODE_SIZE_LARGE:
        size = 180
        border = 2
        break
      case QRCODE_SIZE_XLARGE:
        size = 250
        border = 2
        break
      case QRCODE_SIZE_XXLARGE:
        size = 300
        border = 2
        break
    }

    return (
      <Container size={size} {...rest}>
        <CropWrapper size={size}>
          <TopLeft border={border} borderColor="primaryAccent" size={size} />
          <TopRight border={border} borderColor="primaryAccent" size={size} />
          <BottomLeft border={border} borderColor="primaryAccent" size={size} />
          <BottomRight border={border} borderColor="primaryAccent" size={size} />
        </CropWrapper>
        <CodeWrapper isObfuscated={isObfuscated}>
          <Code
            bgColor={(theme && theme.colors[bg]) || bg}
            fgColor={(theme && theme.colors[color]) || color}
            level="L"
            renderAs="svg"
            size={size}
            value={value}
          />
        </CodeWrapper>
        <Mask isObfuscated={isObfuscated} />
      </Container>
    )
  }
}

export default withTheme(ZapQRCode)
