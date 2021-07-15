import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { Heading } from 'components/UI'

import messages from './messages'
import NodeCardView from './NodeCardView'

const NodeCardList = ({ nodes, updateContactFormSearchQuery, ...rest }) => (
  <Box as="article" {...rest}>
    {Boolean(nodes && nodes.length) && (
      <>
        <Heading.H1 mb={3}>
          <FormattedMessage {...messages.node_suggestions_title} />
        </Heading.H1>
        <Flex flexWrap="wrap">
          {nodes.map((nodeInfo, index) => {
            const column = index % 3
            const isLeft = column === 0
            const isRight = column === 2

            let pl = 3
            let pr = 3
            if (isLeft) {
              pl = 0
              pr = 4
            } else if (isRight) {
              pr = 0
              pl = 4
            }

            return (
              <Flex key={nodeInfo.pubkey} pb={4} pl={pl} pr={pr} width={1 / 3}>
                <NodeCardView {...nodeInfo} nodeClicked={updateContactFormSearchQuery} width={1} />
              </Flex>
            )
          })}
        </Flex>
      </>
    )}
  </Box>
)

NodeCardList.propTypes = {
  nodes: PropTypes.array,
  updateContactFormSearchQuery: PropTypes.func.isRequired,
}

NodeCardList.defaultProps = {
  nodes: [],
}

export default React.memo(NodeCardList)
