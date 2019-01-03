import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import AngleRight from 'components/Icon/AngleRight'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './Menu.scss'

const Menu = ({ history, setActiveSubMenu }) => (
  <ul>
    <li className={styles.fiat} onClick={() => setActiveSubMenu('fiat')}>
      <FormattedMessage {...messages.fiat} />
      <AngleRight color="gray" width="1.5em" height="1.5em" />
    </li>
    <li className={styles.locale} onClick={() => setActiveSubMenu('locale')}>
      <FormattedMessage {...messages.locale} />
      <AngleRight color="gray" width="1.5em" height="1.5em" />
    </li>
    <li className={styles.fiat} onClick={() => setActiveSubMenu('theme')}>
      <span>
        <FormattedMessage {...messages.theme} />
      </span>
      <AngleRight color="gray" width="1.5em" height="1.5em" />
    </li>
    <li className={styles.fiat} onClick={() => history.push('/logout')}>
      <span>
        <FormattedMessage {...messages.logout} />
      </span>
    </li>
  </ul>
)

Menu.propTypes = {
  setActiveSubMenu: PropTypes.func.isRequired
}

export default withRouter(Menu)
