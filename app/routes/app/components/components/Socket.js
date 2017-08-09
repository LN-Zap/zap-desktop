// @flow
import React, { Component } from 'react'
import Websocket from 'react-websocket'

class Socket extends Component {
  render() {
    const onMessage = ({ event, data }) => {
      console.log('data: ', data)
      this.props.fetchChannels()
      // switch(data.event) {
      //   case CHANNEL_DATA:
      //     console.log('channel data')
      //     if (data.update === 'chan_pending') {
      //       let zapNotification = new Notification({

      //       })
      //     }
      // }
    }
    return (
      <Websocket debug url='ws://localhost:3000/' onMessage={onMessage} />
    )
  }
}

export default Socket