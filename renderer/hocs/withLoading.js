import React from 'react'
import PropTypes from 'prop-types'
import LoadingBolt from 'components/LoadingBolt'

/**
 * withLoading - A HOC that will display the LoadingBolt component whilast the wrapped component is loading.
 *
 * @param {React.Component} Component Component to wrap
 * @returns {React.Component} Wrapped component
 */
const withLoading = Component =>
  class extends React.Component {
    static displayName = 'withLoading'

    static propTypes = {
      children: PropTypes.node,
      hasClose: PropTypes.bool,
      isLoading: PropTypes.bool.isRequired,
      loadingMessage: PropTypes.object,
      onClose: PropTypes.func,
    }

    render() {
      const { isLoading, loadingMessage, onClose, hasClose, children, ...rest } = this.props
      return (
        <>
          <Component {...rest}>{children}</Component>
          <LoadingBolt
            hasClose={hasClose}
            isLoading={isLoading}
            message={loadingMessage}
            onClose={onClose}
          />
        </>
      )
    }
  }

export default withLoading
