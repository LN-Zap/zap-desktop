import React from 'react'

import PropTypes from 'prop-types'

import getDisplayName from '@zap/utils/getDisplayName'

/**
 * withNumberInputMask - A HOC that will add validation of a `required` property to a field.
 *
 * @param {React.Component} Component Component to wrap
 * @returns {React.Component} Wrapped component
 */
const withNumberInputMask = Component =>
  class extends React.Component {
    static displayName = `WithNumberInputMask(${getDisplayName(Component)})`

    static propTypes = {
      fieldApi: PropTypes.object.isRequired,
      onKeyDown: PropTypes.func,
    }

    handleKeyDown = e => {
      const { fieldApi } = this.props
      const { value } = e.target
      const currentSelection = window.getSelection().toString()

      // Do nothing if the key press includes a meta key (support copy/paste etc)
      if (e.metaKey || e.ctrlKey) {
        return
      }

      // Prevent non-numeric values.
      if (e.key.length === 1 && !e.key.match(/^[0-9.]$/)) {
        e.preventDefault()
        return
      }

      // Special handling for period character.
      if (e.key === '.') {
        const isIncludedInValue = value.search(/\./) >= 0
        const isIncludedInCurrentSelection = currentSelection.search(/\./) >= 0
        const isValueEmpty = value.length === 0
        const isStartOfStringSelected = currentSelection && value.startsWith(currentSelection)

        // Prevent change of value if there is already a period and that period is not in the current selection.
        if (isIncludedInValue && !isIncludedInCurrentSelection) {
          e.preventDefault()
          return
        }

        // If this is the first character, or the start of the string is selected, turn it into a valid number.
        if (isValueEmpty || isStartOfStringSelected) {
          e.preventDefault()
          fieldApi.setValue('0.')
          return
        }
      }

      // Run any additional onKeyDown handlers provided by the caller.
      const { onKeyDown } = this.props
      if (onKeyDown) {
        onKeyDown(e)
      }
    }

    render() {
      return <Component {...this.props} onKeyDown={this.handleKeyDown} />
    }
  }

export default withNumberInputMask
