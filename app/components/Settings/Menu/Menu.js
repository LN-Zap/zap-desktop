import React from 'react'
import PropTypes from 'prop-types'
import FaAngleRight from 'react-icons/lib/fa/angle-right'

import { FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './Menu.scss'

const Menu = ({ setActiveSubMenu }) => (
  <ul>
    <li className={styles.fiat} onClick={() => setActiveSubMenu('fiat')}>
      <FormattedMessage {...messages.fiat} />
      <FaAngleRight />
    </li>
    <li className={styles.locale} onClick={() => setActiveSubMenu('locale')}>
      <FormattedMessage {...messages.locale} />
      <FaAngleRight />
    </li>
  </ul>
)

Menu.propTypes = {
  setActiveSubMenu: PropTypes.func.isRequired
}

export default Menu
