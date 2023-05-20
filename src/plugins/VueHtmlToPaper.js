function addStyles(win, styles) {
  styles.forEach((style) => {
    let link = win.document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', style)
    win.document.getElementsByTagName('head')[0].appendChild(link)
  })
}

const VueHtmlToPaper = {
  install(app, options = {}) {
    app.config.globalProperties.$htmlToPaper = (
      el,
      localOptions,
      cb = () => true,
    ) => {
      const defaultOptions = {
        name: '_blank',
        specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
        replace: true,
        styles: [],
      }

      const mergedOptions = Object.assign(
        {},
        defaultOptions,
        options,
        localOptions,
      )

      const { name, specs, replace, styles } = mergedOptions

      const specsString = specs.length ? specs.join(',') : ''

      const element = window.document.getElementById(el)

      if (!element) {
        console.error(`Element to print #${el} not found!`)
        return
      }

      const url = '' // Set a trusted URL here
      const win = window.open(url, name, specsString, replace)

      win.document.write(`
            <html>
              <head>
                <title>${window.document.title}</title>
              </head>
              <body>
                ${element.innerHTML}
              </body>
            </html>
          `)

      addStyles(win, styles)

      setTimeout(() => {
        win.document.close()
        win.focus()
        win.print()
        cb()
      }, 1000)

      return true
    }
  },
}

export default VueHtmlToPaper
