import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themeGet } from 'styled-system'
import { Box, Flex } from 'rebass'
import { Card, Heading } from 'components/UI'
import AutopayAddButton from './AutopayAddButton'
import AutopayLimitBadge from './AutopayLimitBadge'

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
  cursor: pointer;
`

const Overlay = styled(Flex)`
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: none;
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

const TextOverlay = styled(Overlay)`
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`

const AutopayCardView = ({ merchant: { image, nickname, pubkey, isActive }, onClick, ...rest }) => (
  <Box {...rest} onClick={() => onClick(`${pubkey}`)}>
    <CardWithBg mb="12px" src={image}>
      <GradientOverlay />
      <TextOverlay alignItems="center" flexDirection="column" justifyContent="center" p={3}>
        <Heading.h1 fontWeight="normal" textAlign="center">
          {nickname}
        </Heading.h1>
      </TextOverlay>
      <Overlay alignItems="flex-end" justifyContent="center" mt="12px">
        {isActive ? <AutopayLimitBadge /> : <AutopayAddButton />}
      </Overlay>
    </CardWithBg>
  </Box>
)

AutopayCardView.propTypes = {
  merchant: PropTypes.shape({
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    pubkey: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
}

export default React.memo(AutopayCardView)
