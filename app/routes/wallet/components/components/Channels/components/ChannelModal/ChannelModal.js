// @flow
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styles from './ChannelModal.scss'

class ChannelModal extends Component {
  render() {
    const customStyles = {
      overlay: {
        cursor: 'pointer'
      },
      content : {
        top: 'auto',
        left: '20%',
        right: '0',
        bottom: 'auto',
        width: '40%',
        margin: '50px auto'
      }
    }
    const { isOpen, resetChannel, children } = this.props
    return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="No Overlay Click Modal"
      ariaHideApp={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => resetChannel(null)}
      parentSelector={() => document.body}
      style={customStyles}
    >
      {children}
    </ReactModal>
    )
  }
}


export default ChannelModal