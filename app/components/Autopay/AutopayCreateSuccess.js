import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'
import { Text } from 'components/UI'
import AutopayCheck from 'components/Icon/AutopayCheck'

const Container = styled(Flex)`
  height: 200px;
  position: relative;
  &:before {
    content: '';
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-position: center center;
    filter: gray;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0.02; /* Here is your opacity */
  }
`

const AutopayCreateSuccess = ({ merchantLogo }) => {
  return (
    <Container
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      src={merchantLogo}
    >
      <Box color="superGreen" mb={3}>
        <AutopayCheck height={128} width={128} />
      </Box>
      <Text color="gray">You can change your Limit or turn of autopay anytime. Enjoy.</Text>
    </Container>
  )
}

AutopayCreateSuccess.propTypes = {
  merchantLogo: PropTypes.string.isRequired,
}

export default AutopayCreateSuccess
