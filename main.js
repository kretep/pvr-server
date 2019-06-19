
const { app, BrowserWindow } = require('electron')
const { PMManager } = require('./processlauncher')
const { sleep } = require('./utils')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let pmm = new PMManager();

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  pmm.initialize();
  await sleep(2000);
  console.log('launching');
  pmm.launchProcess('mongod', 'run-mongo.js');
  await sleep(5000);
  pmm.launchProcess('restheart', 'run-restheart.js');
  await sleep(5000);
  pmm.launchProcess('server', 'server.js');
  console.log('hi');
  await sleep(2000);
  pmm.listProcesses();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', async () => {
  console.log('killing');
  pmm.kill();
  await sleep(2000);
  console.log('killed');
  app.quit();

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
