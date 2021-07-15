import React from 'react'

import { themeGet } from '@styled-system/theme-get'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import { Card, Heading } from 'components/UI'

const CardWithBg = styled(Card)`
  position: relative;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  height: 250px;
  border-radius: 40px;
  padding: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
`

const GradientOverlay = styled(Card)`
  position: absolute;
  background-image: linear-gradient(
    146deg,
    ${themeGet('colors.tertiaryColor')},
    ${themeGet('colors.primaryColor')}
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

const NodeCardView = ({ host, image, nickname, nodeClicked, pubkey, ...rest }) => (
  <CardWithBg src={image} {...rest} onClick={() => nodeClicked(`${pubkey}@${host}`)}>
    <GradientOverlay />
    <TextOverlay alignItems="center" justifyContent="center">
      <Heading.H1 fontWeight="normal" textAlign="center">
        {nickname}
      </Heading.H1>
    </TextOverlay>
  </CardWithBg>
)

NodeCardView.propTypes = {
  host: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  nodeClicked: PropTypes.func.isRequired,
  pubkey: PropTypes.string.isRequired,
}

export default React.memo(NodeCardView)
