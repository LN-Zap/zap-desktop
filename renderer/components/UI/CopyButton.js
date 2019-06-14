import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import Button from 'components/UI/Button'
import Copy from 'components/Icon/Copy'

const CopyButton = ({ value, hint, onCopy, p, ...rest }) => {
  const doCopy = () => {
    copy(value)
    if (onCopy) {
      onCopy(value)
    }
  }

  const paddingProps = p
    ? {
        px: p,
        py: p,
      }
    : null

  return (
    <Button
      className="hint--left"
      data-hint={hint}
      onClick={doCopy}
      px={0}
      py={0}
      size="small"
      variant="secondary"
      {...paddingProps}
      {...rest}
    >
      <Copy />
    </Button>
  )
}

CopyButton.propTypes = {
  hint: PropTypes.node,
  onCopy: PropTypes.func,
  p: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
}

export default CopyButton
