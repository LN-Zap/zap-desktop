import React from 'react'
import PropTypes from 'prop-types'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'
import Isvg from 'react-inlinesvg'
import checkIcon from 'icons/check.svg'

import { FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './Fiat.scss'

const Fiat = ({ fiatTicker, fiatTickers, disableSubMenu, setFiatTicker }) => (
  <div>
    <header className={styles.submenuHeader} onClick={disableSubMenu}>
      <FaAngleLeft />
      <FormattedMessage {...messages.title} />
    </header>
    <ul className={styles.fiatTickers}>
      {fiatTickers.map(ft => (
        <li
          key={ft}
          className={fiatTicker === ft ? styles.active : ''}
          onClick={() => setFiatTicker(ft)}
        >
          <span>{ft}</span>
          {fiatTicker === ft && <Isvg src={checkIcon} />}
        </li>
      ))}
    </ul>
  </div>
)

Fiat.propTypes = {
  fiatTicker: PropTypes.string.isRequired,
  fiatTickers: PropTypes.array.isRequired,
  disableSubMenu: PropTypes.func.isRequired,
  setFiatTicker: PropTypes.func
}

export default Fiat
