import React from 'react'
import PropTypes from 'prop-types'
import Menu from './Menu'
import Fiat from './Fiat'
import styles from './Settings.scss'

const Settings = ({ settings, setActiveSubMenu, fiatProps }) => {
  const renderSettings = () => {
    switch (settings.activeSubMenu) {
      case 'fiat':
        return <Fiat {...fiatProps} />
      default:
        return <Menu setActiveSubMenu={setActiveSubMenu} />
    }
  }
  return <div className={styles.container}>{renderSettings()}</div>
}

Settings.propTypes = {
  settings: PropTypes.object.isRequired,
  setActiveSubMenu: PropTypes.func.isRequired,
  fiatProps: PropTypes.object.isRequired
}

export default Settings
