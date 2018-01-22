import { shell } from 'electron'
import React, { Component } from 'react'

import { MdSearch } from 'react-icons/lib/md'

import styles from './Help.scss'

class Help extends Component {
  constructor(props) {
    super(props)

    this.state = {
      videos: [
        {
          id: '8kZq6eec49A',
          title: 'Syncing and Depositing - Zap Lightning Network Wallet Tutorial (Video 1)'
        },
        {
          id: 'xSiTH63fOQM',
          title: 'Adding a contact - Zap Lightning Network Wallet Tutorial (Video 2)'
        },
        {
          id: 'c0SLmywYDHU',
          title: 'Making a Lightning Network payment - Zap Lightning Network Wallet Tutorial (Video 3)'
        },
        {
          id: 'Xrx2TiiF90Q',
          title: 'Receive Lightning Network payment - Zap Lightning Network Wallet Tutorial (Video 4)'
        },
        {
          id: 'YfxukBHnwUM',
          title: 'Network Map - Zap Lightning Network Wallet Tutorial (Video 5)'
        },
        {
          id: 'NORklrrYzOg',
          title: 'Using an explorer to add Zap contacts - Zap Lightning Network Wallet Tutorial (Video 6)'
        }
      ],
      searchQuery: ''
    }
  }

  render() {
    const { videos, searchQuery } = this.state
    const filteredVideos = videos.filter(video => video.title.includes(searchQuery))

    return (
      <div className={styles.helpContainer}>
        <header className={styles.header}>
          <h1>Video tutorials</h1>
        </header>

        <div className={styles.search}>
          <label className={`${styles.label} ${styles.input}`} htmlFor='helpSearch'>
            <MdSearch />
          </label>
          <input
            value={searchQuery}
            onChange={event => this.setState({ searchQuery: event.target.value })}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search the video library...'
            type='text'
            id='helpSearch'
          />
        </div>

        <ul className={styles.videos}>
          {
            filteredVideos.map((video, index) => (
              <li key={index}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  frameBorder='0'
                  title={video.id}
                />
                <section className={styles.info} onClick={() => shell.openExternal(`https://www.youtube.com/watch?v=${video.id}`)}>
                  <h2>{video.title}</h2>
                </section>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default Help
