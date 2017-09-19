import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Node.scss'

class Node extends Component {
  render() {
    const { neutrino: { data } } = this.props
    return (
      <div className={styles.container}>
        <div className={styles.pageTerminal}>
          { 
            data.map((line, index) => {
              return (
                <div className={styles.data} key={index}>
                  <span>{index + 1}</span>
                  <span>{line}</span>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

Node.propTypes = {
  neutrino: PropTypes.object.isRequired
}

export default Node
