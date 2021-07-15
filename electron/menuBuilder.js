import os from 'os'
import path from 'path'

import { app, Menu, shell, ipcMain } from 'electron'
import isDev from 'electron-is-dev'

import { getLanguageName, locales } from '@zap/i18n'
import appRootPath from '@zap/utils/appRootPath'
import getPackageDetails from '@zap/utils/getPackageDetails'

import openAboutWindow from './about'

const buildAboutMenu = () => {
  return {
    label: 'About Zap',
    click: () => {
      const { productName, version } = getPackageDetails()
      openAboutWindow(
        {
          icon_path: isDev
            ? path.resolve('resources', 'icon.png')
            : path.resolve(appRootPath(), 'resources', 'icon.png'),
          open_devtools: process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD,
          product_name: `${productName} ${version}`,
        },
        // When running in dev mode, load the about code from source directly.
        // When the app is packaged for production, the about src code is copeid into the dist dir with WebpackCopy.
        isDev
          ? `file://${path.resolve('electron/about/public/', 'about.html')}`
          : `file://${path.resolve(app.getAppPath(), 'dist/about/public/', 'about.html')}`
      )
    },
  }
}

export default class ZapMenuBuilder {
  constructor(mainWindow) {
    this.mainWindow = mainWindow
    ipcMain.on('setLocale', (event, locale) => this.buildMenu(locale))
  }

  buildMenu(locale) {
    if (locale) {
      this.locale = locale
    }

    let template
    if (os.platform() === 'darwin') {
      template = this.buildDarwinTemplate()
    } else {
      template = this.buildDefaultTemplate()
    }

    this.setupInputTemplate()

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    return menu
  }

  setupInputTemplate() {
    const selectionMenu = Menu.buildFromTemplate([
      { role: 'copy' },
      { type: 'separator' },
      { role: 'selectall' },
    ])

    const inputMenu = Menu.buildFromTemplate([
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'selectall' },
    ])

    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { selectionText, isEditable } = props

      if (isEditable) {
        inputMenu.popup(this.mainWindow)
      } else if (selectionText && selectionText.trim() !== '') {
        selectionMenu.popup(this.mainWindow)
      }
    })
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'Electron',
      submenu: [
        buildAboutMenu(),
        { type: 'separator' },
        {
          label: 'Preferences…',
          accelerator: 'Command+,',
          click: () => this.mainWindow.webContents.send('openPreferences'),
        },
        { type: 'separator' },
        { label: 'Hide Zap', accelerator: 'Command+H', selector: 'hide:' },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          },
        },
      ],
    }
    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' },
      ],
    }
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload()
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.toggleDevTools()
          },
        },
      ],
    }
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          },
        },
      ],
    }
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    }
    const subMenuHelp = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://zap.jackmallers.com/')
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal('https://github.com/LN-Zap/zap-desktop')
          },
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://zaphq.slack.com')
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/LN-Zap/zap-desktop/issues')
          },
        },
      ],
    }

    const subMenuView = process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd

    return [
      subMenuAbout,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp,
      this.buildLanguageMenu(),
    ]
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close()
            },
          },
          { type: 'separator' },
          {
            label: '&Preferences…',
            accelerator: 'Ctrl+,',
            click: () => this.mainWindow.webContents.send('openPreferences'),
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload()
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.toggleDevTools()
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                  },
                },
              ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('https://zap.jackmallers.com/')
            },
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal('https://github.com/LN-Zap/zap-desktop')
            },
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('zaphq.slack.com')
            },
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/LN-Zap/zap-desktop/issues')
            },
          },
          buildAboutMenu(),
        ],
      },
      this.buildLanguageMenu(),
    ]

    return templateDefault
  }

  buildLanguageMenu() {
    return {
      label: 'Language',
      submenu: locales.map(locale => {
        return {
          label: getLanguageName(locale),
          type: 'radio',
          checked: this.locale === locale,
          click: () => this.mainWindow.webContents.send('receiveLocale', locale),
        }
      }),
    }
  }
}
