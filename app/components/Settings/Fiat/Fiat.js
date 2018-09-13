import React from 'react'
import PropTypes from 'prop-types'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import Isvg from 'react-inlinesvg'
import checkIcon from 'icons/check.svg'
import styles from './Fiat.scss'

const Fiat = ({ fiatTicker, fiatTickers, disableSubMenu, setFiatTicker }) => (
  <div>
    <header className={styles.submenuHeader} onClick={disableSubMenu}>
      <MdKeyboardArrowLeft />
      <span>Fiat currency</span>
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
  setFiatTicker: PropTypes.func.isRequired
}

export default Fiat
