import React from 'react'

import PropTypes from 'prop-types'

import LoadingApp from './LoadingApp'
import LoadingBolt from './LoadingBolt'
import LoadingLaunchpad from './LoadingLaunchpad'

const VARIANTS = {
  bolt: LoadingBolt,
  app: LoadingApp,
  launchpad: LoadingLaunchpad,
}

const Loading = ({ variant, isLoading, ...rest }) => {
  const Component = VARIANTS[variant]
  if (Component) {
    return <Component isLoading={isLoading} {...rest} />
  }

  return null
}

Loading.propTypes = {
  isLoading: PropTypes.bool,
  variant: PropTypes.string.isRequired,
}

export default Loading
