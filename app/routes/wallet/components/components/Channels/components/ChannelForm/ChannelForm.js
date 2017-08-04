// @flow
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styles from './ChannelForm.scss'

class ChannelForm extends Component {
  render() {
  	const customStyles = {
      overlay: {
        cursor: 'pointer',
        overflowY: 'auto'
      },
      content : {
        top: 'auto',
        left: '20%',
        right: '0',
        bottom: 'auto',
        width: '40%',
        margin: '50px auto',
        padding: '40px'
      }
    }
    
    const { form, setForm } = this.props
    return (
      <div>
        <ReactModal
	        isOpen={form.isOpen}
	        contentLabel="No Overlay Click Modal"
	        ariaHideApp={true}
	        shouldCloseOnOverlayClick={true}
	        onRequestClose={() => setForm(false)}
	        parentSelector={() => document.body}
	        style={customStyles}
	      >
	      	<div className={styles.form}>
	      		<h1 className={styles.title}>Open a new channel</h1>
	      		
	      		<section className={styles.pubkey}>
	      			<label>With</label>
	      			<input
                type='text'
                size=''
                placeholder='Public key'
              />
	      		</section>
	      		<section className={styles.local}>
	      			<label>Local</label>
	      			<input
                type='text'
                size=''
                placeholder='Local amount'
              />
	      		</section>
	      		<section className={styles.push}>
	      			<label>Push</label>
	      			<input
                type='text'
                size=''
                placeholder='Push amount'
              />
	      		</section>

	      		<div className={styles.buttonGroup}>
	      			<div className={styles.button}>
	      				Submit
	      			</div>
	      		</div>
	      	</div>
      	</ReactModal>
      </div>
    )
  }
}


export default ChannelForm