import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Heading } from 'components/UI'
import NodeCardView from './NodeCardView'
import messages from './messages'

const NodeCardList = ({ nodes, updateContactFormSearchQuery, ...rest }) => (
  <Box as="article" {...rest}>
    <Heading.h1 mb={3}>
      <FormattedMessage {...messages.node_suggestions_title} />
    </Heading.h1>
    <Flex flexWrap="wrap">
      {nodes.map((nodeInfo, index) => {
        const column = index % 3
        const isLeft = column === 0
        const isMiddle = column === 1
        const isRight = column === 2

        return (
          <Flex
            key={nodeInfo.pubkey}
            width={1 / 3}
            pl={isLeft ? 0 : isMiddle ? 3 : 4}
            pr={isRight ? 0 : isMiddle ? 3 : 4}
            pb={4}
          >
            <NodeCardView {...nodeInfo} nodeClicked={updateContactFormSearchQuery} width={1} />
          </Flex>
        )
      })}
    </Flex>
  </Box>
)

NodeCardList.propTypes = {
  nodes: PropTypes.array,
  updateContactFormSearchQuery: PropTypes.func.isRequired
}

NodeCardList.defaultProps = {
  nodes: []
}

export default React.memo(NodeCardList)
