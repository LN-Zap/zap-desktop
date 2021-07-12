import React from 'react'

import PropTypes from 'prop-types'

import LoadingBolt from 'containers/Loading'

/**
 * withLoading - A HOC that will display the LoadingBolt component whilst the wrapped component is loading.
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
      pathname: PropTypes.string.isRequired,
    }

    render() {
      const {
        isLoading,
        pathname,
        loadingMessage,
        onClose,
        hasClose,
        children,
        ...rest
      } = this.props
      return (
        <>
          <Component {...rest}>{children}</Component>
          <LoadingBolt
            hasClose={hasClose}
            isLoading={isLoading}
            message={loadingMessage}
            onClose={onClose}
            pathname={pathname}
          />
        </>
      )
    }
  }

export default withLoading
