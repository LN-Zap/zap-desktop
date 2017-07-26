// @flow
import React, { Component } from 'react'
import { MdSearch } from 'react-icons/lib/md'
import styles from './Home.scss'

class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.search}>
        	<label className={`${styles.label} ${styles.input}`}>
        		<MdSearch />
        	</label>
        	<input className={`${styles.text} ${styles.input}`} placeholder='Search transactions by amount, pubkey, channel' type='text' />
        </div>
      </div>
    )
  }
}


export default Home