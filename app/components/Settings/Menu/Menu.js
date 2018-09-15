import React from 'react'
import PropTypes from 'prop-types'
import { MdKeyboardArrowRight } from 'react-icons/md'

import { FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './Menu.scss'

const Menu = ({ setActiveSubMenu }) => (
  <ul>
    <li className={styles.fiat} onClick={() => setActiveSubMenu('fiat')}>
      <FormattedMessage {...messages.locale} />
      <MdKeyboardArrowRight />
    </li>
    <li className={styles.locale} onClick={() => setActiveSubMenu('locale')}>
      <FormattedMessage {...messages.locale} />
      <MdKeyboardArrowRight />
    </li>
  </ul>
)

Menu.propTypes = {
  setActiveSubMenu: PropTypes.func.isRequired
}

export default Menu
