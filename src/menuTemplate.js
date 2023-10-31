const { app } = require('electron')
const isMac = process.platform === 'darwin'

const template = [
  { id: '1', label: 'one' },
  { id: '2', label: 'two' },
  { id: '3', label: 'three' },
  { id: '4', label: 'four' }
]
module.exports = template
