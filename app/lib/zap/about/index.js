// based on https://github.com/rhysd/electron-about-window
'use strict'

import electron, { BrowserWindow } from 'electron'

const path = require('path')

let window = null

function openAboutWindow(info, htmlPath) {
  if (window !== null) {
    window.focus()
    return window
  }

  const options = {
    width: 300,
    height: 300,
    useContentSize: true,
    titleBarStyle: 'hidden-inset',
    show: !info.adjust_window_size,
    icon: info.icon_path,
    webPreferences: {
      nodeIntegration: false,
      preload: process.env.HOT
        ? path.resolve(__dirname, 'preload.js')
        : path.resolve(__dirname, 'about_preload.prod.js')
    }
  }
  window = new BrowserWindow(options)

  window.once('closed', () => {
    window = null
  })
  window.loadURL(htmlPath)
  window.webContents.on('will-navigate', (e, url) => {
    e.preventDefault()
    electron.shell.openExternal(url)
  })
  window.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    electron.shell.openExternal(url)
  })
  window.webContents.once('dom-ready', () => {
    delete info.win_options
    window.webContents.send('about-window:info', info)
    if (info.open_devtools) {
      if (process.versions.electron >= '1.4') {
        window.webContents.openDevTools({ mode: 'detach' })
      } else {
        window.webContents.openDevTools()
      }
    }
  })
  window.once('ready-to-show', () => {
    window.show()
  })
  window.setMenu(null)
  return window
}

export default openAboutWindow
