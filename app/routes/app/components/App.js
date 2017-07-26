// @flow
import React, { Component } from 'react'
import Nav from './components/Nav.js'
import styles from './App.scss'

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <div className={styles.content}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.object
}

export default App