import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'

/**
 * @render react
 * @name Page
 * @example
 * <Page>Some content</Page>
 */
const Page = ({ css, ...rest }) => (
  <Flex
    bg="primaryColor"
    as="article"
    css={Object.assign(
      {
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        'min-width': '900px',
        'min-height': '425px',
        'box-shadow': '0 20px 70px rgba(0, 0, 0, 0.55)'
      },
      css
    )}
    {...rest}
  />
)

Page.propTypes = {
  css: PropTypes.object
}

export default Page
