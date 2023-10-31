const { app, BrowserWindow, Menu, ipcMain, dialog, BrowserView, desktopCapturer } = require('electron')
const path = require('path')
// const menuTemplate = require('./src/menuTemplate')
const isDev = require('electron-is-dev')

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
        return
    } else {
        return filePaths[0]
    }
}
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // 创建一个‘子窗口’
    const view = new BrowserView()
    mainWindow.setBrowserView(view)
    view.setBounds({ x: 0, y: 0, width: 300, height: 600 })
    view.webContents.loadURL('https://electronjs.org')

    const urlLocation = isDev ? 'http://localhost:3000' : 'dummyurl'
    mainWindow.loadURL(urlLocation)

    // set the menu    
    const menu = Menu.buildFromTemplate([
        {
            label: '菜单',
            submenu: [
                {
                    click: () => mainWindow.webContents.send('update-counter', 1),
                    label: '增加',
                },
                {
                    click: () => mainWindow.webContents.send('update-counter', -1),
                    label: '减少',
                }
            ]
        }

    ])
    Menu.setApplicationMenu(menu)

    // 自动打开控制台
    mainWindow.webContents.openDevTools()

    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        for (const source of sources) {
            if (source.name === 'Electron') {
                mainWindow.webContents.send('SET_SOURCE', source.id)
                return
            }
        }
    })

}

app.whenReady().then(() => {

    ipcMain.handle('dialog:openFile', handleFileOpen)
    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.setTitle(title)
    })
    createWindow()

    // 如果没有窗口打开则打开一个窗口 (macOS)
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})



// 关闭所有窗口时退出应用 (Windows & Linux)
// 在Windows和Linux上，关闭所有窗口通常会完全退出一个应用程序。
// 为了实现这一点，你需要监听 app 模块的 'window-all-closed' 事件。如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})


// 这段代码没有作用
// app.on('ready', () => {
//     // require('devtron').install() // devtron 已经处于不维护的状态了 新版 electron 是不支持的
//     mainWindow = new BrowserWindow({
//         width: 1100,
//         height: 650,
//         webPreferences: {
//             nodeIntegration: true,
//             preload: path.join(__dirname, "preload.js"),
//         }
//     })
//     const urlLocation = isDev ? 'http://localhost:3000' : 'dummyurl'
//     mainWindow.loadURL(urlLocation)

//     // set the menu
//     let menu = Menu.buildFromTemplate(menuTemplate)
//     Menu.setApplicationMenu(menu)

//     // 自动打开
//     mainWindow.webContents.openDevTools()

//     ipcMain.on('set-title', handleSetTitle)
// })

