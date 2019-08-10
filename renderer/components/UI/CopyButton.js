import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import copy from 'copy-to-clipboard'
import Button from 'components/UI/Button'
import Copy from 'components/Icon/Copy'
import messages from './messages'
import { intlShape } from '@zap/i18n'

const CopyButton = ({ value, hint, intl, onCopy, p, size, ...rest }) => {
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
      data-hint={hint || intl.formatMessage({ ...messages.copy_to_clipboard })}
      onClick={doCopy}
      px={0}
      py={0}
      size="small"
      variant="secondary"
      {...paddingProps}
      {...rest}
    >
      <Copy height={size} width={size} />
    </Button>
  )
}

CopyButton.propTypes = {
  hint: PropTypes.node,
  intl: intlShape.isRequired,
  onCopy: PropTypes.func,
  p: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.string,
  value: PropTypes.string,
}

CopyButton.defaultProps = {
  size: '1em',
}

export default injectIntl(CopyButton)
