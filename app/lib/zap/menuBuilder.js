// @flow
import { app, Menu, shell, BrowserWindow, ipcMain } from 'electron'
import { locales, getLocale, getLanguageName } from '../utils/i18n'

export default class ZapMenuBuilder {
  mainWindow: BrowserWindow
  locale: string

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.locale = getLocale()
    ipcMain.on('setLocale', (event, locale) => this.buildMenu(locale))
  }

  buildMenu(locale?: string) {
    if (locale) {
      this.locale = locale
    }

    let template
    if (process.platform === 'darwin') {
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
      { role: 'selectall' }
    ])

    const inputMenu = Menu.buildFromTemplate([
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'selectall' }
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
        { label: 'About Zap', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        { label: 'Hide Zap', accelerator: 'Command+H', selector: 'hide:' },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          }
        }
      ]
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
        { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }
      ]
    }
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload()
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.toggleDevTools()
          }
        }
      ]
    }
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          }
        }
      ]
    }
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    }
    const subMenuHelp = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://zap.jackmallers.com/')
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal('https://github.com/LN-Zap/zap-desktop')
          }
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('zaphq.slack.com')
          }
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/LN-Zap/zap-desktop/issues')
          }
        }
      ]
    }

    const subMenuView = process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd

    return [
      subMenuAbout,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp,
      this.buildLanguageMenu()
    ]
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O'
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close()
            }
          }
        ]
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
                  }
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                  }
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.toggleDevTools()
                  }
                }
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                  }
                }
              ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('https://zap.jackmallers.com/')
            }
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal('https://github.com/LN-Zap/zap-desktop')
            }
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('zaphq.slack.com')
            }
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/LN-Zap/zap-desktop/issues')
            }
          }
        ]
      },
      this.buildLanguageMenu()
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
          click: () => this.mainWindow.webContents.send('receiveLocale', locale)
        }
      })
    }
  }
}
