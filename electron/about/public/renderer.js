'use strict'
Object.defineProperty(exports, '__esModule', { value: true })

window.ipcRenderer.on('about-window:info', (_, info) => {
  const app_name = info.product_name
  const content = info.use_inner_html ? 'innerHTML' : 'innerText'
  document.title = `About ${app_name}`
  const title_elem = document.querySelector('.title')
  title_elem.innerText = `${app_name}`

  const copyright_elem = document.querySelector('.copyright')
  if (info.copyright) {
    copyright_elem[content] = info.copyright
  } else if (info.license) {
    copyright_elem[content] = `Distributed under ${info.license} license.`
  }
  const icon_elem = document.getElementById('app-icon')
  icon_elem.src = info.icon_path
  if (info.description) {
    const desc_elem = document.querySelector('.description')
    desc_elem[content] = info.description
  }

  if (info.css_path) {
    const css_paths = Array.isArray(info.css_path) ? info.css_path : [info.css_path]
    for (const css_path of css_paths) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = css_path
      document.head.appendChild(link)
    }
  }

  if (info.use_version_info) {
    const versions = document.querySelector('.versions')
    const vs = process.versions
    for (const name of ['electron', 'chrome', 'node', 'v8']) {
      const tr = document.createElement('tr')
      const name_td = document.createElement('td')
      name_td.innerText = name
      tr.appendChild(name_td)
      const version_td = document.createElement('td')
      version_td.innerText = ' : ' + vs[name]
      tr.appendChild(version_td)
      versions.appendChild(tr)
    }
  }
})
//# sourceMappingURL=renderer.js.map
