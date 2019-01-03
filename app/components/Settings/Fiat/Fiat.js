import React from 'react'
import PropTypes from 'prop-types'
import { Span } from 'components/UI'
import AngleLeft from 'components/Icon/AngleLeft'
import Check from 'components/Icon/Check'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './Fiat.scss'

const Fiat = ({ fiatTicker, fiatTickers, disableSubMenu, setFiatTicker }) => (
  <div>
    <header className={styles.submenuHeader} onClick={disableSubMenu}>
      <AngleLeft color="gray" width="1.5em" height="1.5em" />
      <Span ml={2}>
        <FormattedMessage {...messages.title} />
      </Span>
    </header>
    <ul className={styles.fiatTickers}>
      {fiatTickers.map(ft => (
        <li
          key={ft}
          className={fiatTicker === ft ? styles.active : ''}
          onClick={() => setFiatTicker(ft)}
        >
          <span>{ft}</span>
          {fiatTicker === ft && <Check />}
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
