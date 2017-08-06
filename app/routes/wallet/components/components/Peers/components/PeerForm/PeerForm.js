// @flow
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styles from './PeerForm.scss'

class PeerForm extends Component {
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
          isOpen={fosrm.isOpen}
          contentLabel="No Overlay Click Modal"
          ariaHideApp={true}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => setForm(false)}
          parentSelector={() => document.body}
          style={customStyles}
        >
          <h1>Peer form</h1>
        </ReactModal>
      </div>
    )
  }
}


export default PeerForm