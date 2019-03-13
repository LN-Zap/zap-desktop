import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { Card, Heading } from 'components/UI'

const CardWithBg = styled(Card)`
  position: relative;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  height: 300px;
  width: 195px;
  border-radius: 40px;
  padding: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
`

const GradientOverlay = styled(Card)`
  position: absolute;
  background-image: linear-gradient(
    146deg,
    ${props => props.theme.colors.tertiaryColor},
    ${props => props.theme.colors.primaryColor}
  );
  opacity: 0.5;
  width: 100%;
  height: 100%;
  border-radius: 40px;
  transition: all 0.25s;
  &:hover {
    opacity: 0;
  }
`

const TextOverlay = styled(Flex)`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
`

const AutopayCardView = ({ merchant: { host, image, nickname, pubkey }, onClick, ...rest }) => (
  <CardWithBg src={image} {...rest} onClick={() => onClick(`${pubkey}@${host}`)}>
    <GradientOverlay />
    <TextOverlay alignItems="center" flexDirection="column" justifyContent="center" p={3}>
      <Heading.h1 fontWeight="normal" textAlign="center">
        {nickname}
      </Heading.h1>
    </TextOverlay>
  </CardWithBg>
)

AutopayCardView.propTypes = {
  merchant: PropTypes.shape({
    description: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    pubkey: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
}

export default React.memo(AutopayCardView)
