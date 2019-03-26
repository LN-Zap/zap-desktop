import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import styled from 'styled-components'
import { opacity } from 'styled-system'
import { Box as BaseBox, Flex as BaseFlex } from 'rebass'
import { Bar, Card, Heading, Panel, Text } from 'components/UI'
import { withEllipsis } from 'hocs'
import ChannelData from './ChannelData'
import ChannelCapacity from './ChannelCapacity'
import ChannelMoreButton from './ChannelMoreButton'
import ChannelStatus from './ChannelStatus'
import messages from './messages'

const ClippedHeading = withEllipsis(Heading.h1)
const ClippedText = withEllipsis(Text)
const Box = styled(BaseBox)(opacity)
const Flex = styled(BaseFlex)(opacity)

const ChannelCardListItem = React.memo(
  ({ intl, channel, currencyName, openModal, setSelectedChannel, networkInfo, ...rest }) => {
    const {
      channel_point,
      display_name,
      display_pubkey,
      local_balance,
      remote_balance,
      display_status,
      active,
    } = channel
    const opacity = active ? 1 : 0.3
    return (
      <Card {...rest}>
        <Panel>
          <Panel.Header>
            <Flex justifyContent="space-between">
              <ClippedHeading my={1} opacity={opacity}>
                {display_name}
              </ClippedHeading>

              <ChannelStatus mb="auto" status={display_status} />
            </Flex>
            <Flex justifyContent="space-between" opacity={opacity}>
              <Text fontWeight="normal">
                <FormattedMessage {...messages.remote_pubkey} />
              </Text>
              <ClippedText width={2 / 3}>{display_pubkey}</ClippedText>
            </Flex>
            <Box opacity={opacity}>
              <Bar my={2} variant="light" />
            </Box>
          </Panel.Header>

          <Panel.Body>
            <ChannelCapacity
              localBalance={local_balance}
              my={4}
              opacity={opacity}
              remoteBalance={remote_balance}
            />

            <ChannelData
              as="section"
              channel={channel}
              currencyName={currencyName}
              networkInfo={networkInfo}
              opacity={opacity}
            />
          </Panel.Body>

          <Panel.Footer>
            <Flex alignItems="flex-end" as="footer" justifyContent="center">
              <ChannelMoreButton
                isDisabled={!channel_point}
                onClick={() => {
                  setSelectedChannel(channel_point)
                  openModal('CHANNEL_DETAIL')
                }}
              />
            </Flex>
          </Panel.Footer>
        </Panel>
      </Card>
    )
  }
)

ChannelCardListItem.displayName = 'ChannelCardListItem'

ChannelCardListItem.propTypes = {
  channel: PropTypes.object.isRequired,
  currencyName: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
}

export default injectIntl(ChannelCardListItem)
