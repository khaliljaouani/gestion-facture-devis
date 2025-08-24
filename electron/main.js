import { app, BrowserWindow, dialog } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import pkg from 'electron-updater'
const { autoUpdater } = pkg

import fs from 'fs/promises'

// IMPORTANT : importer ton serveur directement
import '../server/index.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isDev = !app.isPackaged

async function ensureAppFolders() {
  const documents = app.getPath('documents')
  const root = path.join(documents, 'gestion pneu roeun')
  await fs.mkdir(path.join(root, 'database'), { recursive: true })
  await fs.mkdir(path.join(root, 'facture', 'facture_cacher'), { recursive: true })
  await fs.mkdir(path.join(root, 'devis'), { recursive: true })
  return root
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:5173/')
    win.webContents.openDevTools()
  } else {
    const indexHtml = path.join(__dirname, '..', 'frontend', 'dist', 'index.html')
    win.loadFile(indexHtml)
  }
  return win
}

function setupAutoUpdate(win) {
  autoUpdater.on('checking-for-update', () => console.log('🔎 Vérification MAJ...'))
  autoUpdater.on('update-available', () => console.log('⬇️ MAJ disponible'))
  autoUpdater.on('update-not-available', () => console.log('✅ Aucune MAJ'))
  autoUpdater.on('error', (err) => console.error('AutoUpdate error:', err))
  autoUpdater.on('download-progress', (p) =>
    console.log(`Téléchargement: ${Math.round(p.percent || 0)}%`)
  )
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(win, {
      type: 'info',
      buttons: ['Redémarrer maintenant'],
      title: 'Mise à jour prête',
      message: 'Une mise à jour a été téléchargée. L’application va redémarrer.'
    }).then(() => autoUpdater.quitAndInstall())
  })
  autoUpdater.checkForUpdatesAndNotify().catch(console.error)
}

app.whenReady().then(async () => {
  await ensureAppFolders()
  const win = createWindow()
  setupAutoUpdate(win)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
