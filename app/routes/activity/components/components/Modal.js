// @flow
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import Moment from 'react-moment'
import 'moment-timezone'


class Modal extends Component {
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
		const {
      isOpen,
      resetObject,
      children
    } = this.props
    
		return (
			<ReactModal
        isOpen={isOpen}
        contentLabel="No Overlay Click Modal"
        ariaHideApp={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => resetObject(null)}
        parentSelector={() => document.body}
        style={customStyles}
      >
        {children}
      </ReactModal>
		)
	}
}

export default Modal