import React from 'react'
import PropTypes from 'prop-types'
import LoadingBolt from './LoadingBolt'
import LoadingApp from './LoadingApp'
import LoadingLaunchpad from './LoadingLaunchpad'

const VARIANTS = {
  bolt: LoadingBolt,
  app: LoadingApp,
  launchpad: LoadingLaunchpad,
}

const Loading = ({ variant, isLoading }) => {
  const Component = VARIANTS[variant]
  if (Component) {
    return <Component isLoading={isLoading} />
  }

  return null
}

Loading.propTypes = {
  isLoading: PropTypes.bool,
  variant: PropTypes.string.isRequired,
}

export default Loading
