// @flow
import React, { Component } from 'react'
import { MdSearch } from 'react-icons/lib/md'
import Payments from './components/Payments'
import Invoices from './components/Invoices'
import styles from './Activity.scss'

class Activity extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tab: 2
    }
  }

  componentWillMount() {
    this.props.fetchActivity()
  }

  render() {
    const { tab } = this.state
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

        <div className={styles.activities}>
          <header className={styles.header}>
            <span 
              className={`${styles.title} ${tab === 1 ? styles.active : null}`}
              onClick={() => this.setState({ tab: 1 })}
            >
              Payments
            </span>
            <span
              className={`${styles.title} ${tab === 2 ? styles.active : null}`}
              onClick={() => this.setState({ tab: 2 })}
            >
              Invoices
            </span>
          </header>
          <div className={styles.activityContainer}>
            {
              tab === 1 ?
                <Payments payments={payments} />
              :
                <Invoices invoices={invoices} />
            }
          </div>
        </div>
      </div>
    )
  }
}


export default Activity