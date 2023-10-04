const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const path = require('node:path')

const NOTIFICATION_TITLE = 'Basic Notification'
const NOTIFICATION_BODY = 'you have started the electron app'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

function showNotification() {
  console.log('beans')
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY}).show()
}

async function pingJoke() {
  try {
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers : {
        "Accept": "application/json"
      }
    })
    const joke = await response.json()
    return joke
  }
  catch(e){
    return e
  }
}


app.whenReady().then(() => {
  ipcMain.handle('ping', pingJoke)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}).then(createWindow).then(showNotification)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})