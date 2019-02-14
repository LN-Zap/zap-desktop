import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import LoadingBolt from 'components/LoadingBolt'

const LoadingBoltWithTheme = withTheme(LoadingBolt)

/**
 * A HOC that will display the LoadingBolt component whilast the wrapped component is loading.
 * @param {React.Component} Component Component to wrap
 */
const withLoading = Component =>
  class extends React.Component {
    static displayName = 'withLoading'

    static propTypes = {
      children: PropTypes.node,
      isLoading: PropTypes.bool.isRequired,
      loadingMessage: PropTypes.string
    }

    /**
     * Render the loading bolt ontop of the wrapped component for as long as needed.
     */
    render() {
      const { isLoading, loadingMessage, children, ...rest } = this.props
      return (
        <>
          <Component {...rest}>{children}</Component>
          <LoadingBoltWithTheme isLoading={isLoading} message={loadingMessage} />
        </>
      )
    }
  }

export default withLoading
