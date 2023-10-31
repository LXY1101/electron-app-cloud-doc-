// 通过预加载脚本暴露 ipcRenderer.send
// 出于 安全原因，我们不会直接暴露整个 ipcRenderer.send API。 确保尽可能限制渲染器对 Electron API 的访问。
// 采用contextBridge的优势是不需要在渲染进程中处理Node.js模块，并能像函数一样进行调用，非常适合React开发，尤其是Hooks使用

const { contextBridge, ipcRenderer, clipboard, contentTracing } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // 要将单向 IPC 消息从渲染器进程发送到主进程，可以使用 ipcRenderer.send API 发送消息，然后使用 ipcMain.on API 接收。
    setTitle: (title) => ipcRenderer.send('set-title', title),

    // 双向 IPC 的一个常见应用是从渲染器进程代码调用主进程模块并等待结果。 这可以通过将 ipcRenderer.invoke 与 ipcMain.handle 搭配使用来完成。
    openFile: () => ipcRenderer.invoke('dialog:openFile'),

    // 将消息从主进程发送到渲染器进程时，需要指定是哪一个渲染器接收消息。 消息需要通过其 WebContents 实例发送到渲染器进程。
    // 此 WebContents 实例包含一个 send 方法，其使用方式与 ipcRenderer.send 相同。
    handleCounter: (callback) => ipcRenderer.on('update-counter', callback),

    // 写入剪贴板-纯文本
    writeText: (text) => clipboard.writeText(text),
    // 读取剪贴板-纯文本
    readText: () => clipboard.readText(),
    // 写入剪贴板-html文本
    writeHTML: (html) => clipboard.writeHTML(html),
    // 读取剪贴板-html文本
    readHTML: () => clipboard.readHTML(),

    // contentTracing内容追踪
    // 在所有进程上开始记录
    startRecording: () => contentTracing.startRecording({
        included_categories: ['*']
    }),

    // 停止所有进程记录
    stopRecording: () => contentTracing.stopRecording()

})

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        }
      })
      handleStream(stream)
    } catch (e) {
      handleError(e)
    }
  })
  
  function handleStream (stream) {
    const video = document.querySelector('video')
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
  }
  
  function handleError (e) {
    console.log(e)
  }