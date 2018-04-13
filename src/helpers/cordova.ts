
export const deviceIsReady = new Promise(resolve => {
  document.addEventListener('deviceready', () => {
    console.log('device is ready')
    resolve()
  })
})

export const appClosing = new Promise(resolve => {
  window.addEventListener('unload', () => resolve())
})
