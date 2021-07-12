import React from 'react'

import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box as BaseBox, Flex as BaseFlex } from 'rebass/styled-components'
import styled from 'styled-components'
import { opacity } from 'styled-system'

import { intlShape } from '@zap/i18n'
import Padlock from 'components/Icon/Padlock'
import { Bar, Card, Heading, Panel, Text } from 'components/UI'
import { withEllipsis } from 'hocs'

import ChannelCapacity from './ChannelCapacity'
import ChannelData from './ChannelData'
import ChannelMoreButton from './ChannelMoreButton'
import ChannelStatus from './ChannelStatus'
import messages from './messages'

const ClippedHeading = withEllipsis(Heading.H1)
const ClippedText = withEllipsis(Text)
const Box = styled(BaseBox)(opacity)
const Flex = styled(BaseFlex)(opacity)

const areEqual = (prevProps, nextProps) => isEqual(prevProps, nextProps)

const ChannelCardListItem = React.memo(
  ({ channel, cryptoUnitName, openModal, setSelectedChannel, networkInfo, ...rest }) => {
    const {
      channelPoint,
      displayName,
      displayPubkey,
      localBalance,
      remoteBalance,
      displayStatus,
      active,
      private: isPrivate,
    } = channel
    const opacity = active ? 1 : 0.3

    return (
      <Card {...rest}>
        <Panel>
          <Panel.Header>
            <Flex justifyContent="space-between">
              <ClippedHeading my={1} opacity={opacity}>
                {displayName}
              </ClippedHeading>

              <Flex>
                {isPrivate && (
                  <Box color="gray" fontSize="s" mr={1}>
                    <Padlock />
                  </Box>
                )}
                <ChannelStatus mb="auto" status={displayStatus} />
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" opacity={opacity}>
              <Text fontWeight="normal">
                <FormattedMessage {...messages.remote_pubkey} />
              </Text>
              <ClippedText width={2 / 3}>{displayPubkey}</ClippedText>
            </Flex>
            <Box opacity={opacity}>
              <Bar my={2} variant="light" />
            </Box>
          </Panel.Header>

          <Panel.Body>
            <ChannelCapacity
              localBalance={localBalance}
              my={4}
              opacity={opacity}
              remoteBalance={remoteBalance}
            />

            <ChannelData
              as="section"
              channel={channel}
              cryptoUnitName={cryptoUnitName}
              networkInfo={networkInfo}
              opacity={opacity}
            />
          </Panel.Body>

          <Panel.Footer>
            <Flex alignItems="flex-end" as="footer" justifyContent="center">
              <ChannelMoreButton
                isDisabled={!channelPoint}
                onClick={() => {
                  setSelectedChannel(channelPoint)
                  openModal('CHANNEL_DETAIL')
                }}
              />
            </Flex>
          </Panel.Footer>
        </Panel>
      </Card>
    )
  },
  areEqual
)

ChannelCardListItem.displayName = 'ChannelCardListItem'

ChannelCardListItem.propTypes = {
  channel: PropTypes.object.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
}

export default injectIntl(ChannelCardListItem)
