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
      isLoading: PropTypes.bool.isRequired
    }

    /**
     * Render the loading bolt ontop of the wrapped component for as long as needed.
     */
    render() {
      const { isLoading, theme, children, ...rest } = this.props
      return (
        <React.Fragment>
          <LoadingBoltWithTheme isLoading={isLoading} />
          <Component {...rest}>{children}</Component>
        </React.Fragment>
      )
    }
  }

export default withLoading
