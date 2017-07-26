// @flow
import React, { Component } from 'react'
import { MdSearch } from 'react-icons/lib/md'
import styles from './Activity.scss'

class Activity extends Component {
  componentWillMount() {
    this.props.fetchActivity()
  }

  render() {
    const { activity: { isLoading, payments, invoices } } = this.props
    if (isLoading) { return <div>Loading...</div> }
    return (
      <div>
        <div className={styles.search}>
        	<label className={`${styles.label} ${styles.input}`}>
        		<MdSearch />
        	</label>
        	<input className={`${styles.text} ${styles.input}`} placeholder='Search transactions by amount, pubkey, channel' type='text' />
        </div>

        <div className={styles.transactions}>
          <h2 className={styles.header}>Payments</h2>
          <div className={styles.activityContainer}>
            <ul className={styles.activityList}>
              {
                payments.map((payment, index) => {
                  console.log('payment: ', payment)
                  return (
                    <li key={index} className={styles.activity}>
                      hi
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}


export default Activity