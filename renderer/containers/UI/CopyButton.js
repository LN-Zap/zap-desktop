import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import CopyButton from 'components/UI/CopyButton'
import { showNotification } from 'reducers/notification'
import messages from './messages'
import { intlShape } from '@zap/i18n'

const WrappedCopyButton = ({ intl, onCopy, name, showNotification, value, ...rest }) => {
  const notifyOfCopy = () => {
    showNotification(intl.formatMessage({ ...messages.copied_to_clipbpard }, { name }))
  }

  const handleCopy = () => {
    notifyOfCopy()
    if (onCopy) {
      onCopy(value)
    }
  }

  return <CopyButton onCopy={handleCopy} value={value} {...rest} />
}

WrappedCopyButton.propTypes = {
  intl: intlShape.isRequired,
  name: PropTypes.string.isRequired,
  onCopy: PropTypes.func,
  showNotification: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

const mapDispatchToProps = {
  showNotification,
}

const ConnectedCopyButton = connect(
  null,
  mapDispatchToProps
)(WrappedCopyButton)

export default injectIntl(ConnectedCopyButton)
