// @flow
import React, { Component } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { MdSearch } from 'react-icons/lib/md'
import Payments from './components/Payments'
import Invoices from './components/Invoices'
import styles from './Activity.scss'

class Activity extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tab: 1
    }
  }

  componentWillMount() {
    this.props.fetchActivity()
  }

  render() {
    const { tab } = this.state
    const { activity: { activityLoading, payments, invoices } } = this.props
    
    if (activityLoading) { return <div>Loading...</div> }
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
            <CSSTransitionGroup 
              transitionName='activity'
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
            >
              {
                tab === 1 ?
                  <Payments key={1} payments={payments} />
                :
                  <Invoices key={2} invoices={invoices} />
              }
            </CSSTransitionGroup>
          </div>
        </div>
      </div>
    )
  }
}


export default Activity