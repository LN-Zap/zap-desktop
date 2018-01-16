import { shell } from 'electron'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { MdSearch } from 'react-icons/lib/md'

import styles from './Help.scss'

class Help extends Component {
  constructor(props) {
    super(props)

    this.state = {
      videos: [
        {
          id: 'GYIHrd7e-n0',
          title: 'Joyner Lucas - Mask Off Remix (Mask On)'
        },
        {
          id: 'ZFy7RdZWwj8',
          title: 'Joyner Lucas - Bank Account (Remix)'
        },
        {
          id: 'DlFmfxACvig',
          title: 'Lil Skies - Nowadays ft. Landon Cube (Dir. by @_ColeBennett_)'
        },
        {
          id: 'XbZ0OXmXw38',
          title: 'Dave - Wanna Know ft. Drake (Audio)'
        },
        {
          id: 'sRrcogH7F_I',
          title: 'Bryson Tiller - How About Now (Freestyle)'
        },
        {
          id: 'j6Np8vCO0hQ',
          title: 'Young Pappy - Killa (Official Music Video)'
        },
        {
          id: 'PjqKPHZJgF0',
          title: 'Lil Wayne - Family Feud feat. Drake (Official Audio) | Dedication 6'
        }
      ]
    }
  }

  render() {
    const { videos } = this.state
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
            value={''}
            onChange={event => console.log('gang')}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search the video library...'
            type='text'
            id='helpSearch'
          />
        </div>

        <ul className={styles.videos}>
          {
            videos.map((video, index) => {
              return (
                <li key={index}>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    frameBorder='0'
                  />
                  <section className={styles.info} onClick={() => shell.openExternal(`https://www.youtube.com/watch?v=${video.id}`)}>
                    <h2>{video.title}</h2>
                  </section>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

Help.propTypes = {
  
}

export default Help
