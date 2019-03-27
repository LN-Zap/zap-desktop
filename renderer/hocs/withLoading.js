import React from 'react'
import PropTypes from 'prop-types'
import LoadingBolt from 'components/LoadingBolt'

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
      loadingMessage: PropTypes.object,
    }

    /**
     * Render the loading bolt ontop of the wrapped component for as long as needed.
     */
    render() {
      const { isLoading, loadingMessage, children, ...rest } = this.props
      return (
        <>
          <Component {...rest}>{children}</Component>
          <LoadingBolt isLoading={isLoading} message={loadingMessage} />
        </>
      )
    }
  }

export default withLoading
