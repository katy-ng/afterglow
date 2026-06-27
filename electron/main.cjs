// Electron entry point (desktop/Node.js side)

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const {
  db,
  init,
  addUser,
  getUser,
  addMixtape,
  getAllMixtapes,
  addSong,
  addPolaroid,
  addSticker,
  getAllStickers,
  addStickerPlacement,
} = require('../backend/data/database.cjs');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const rendererPath = path.join(__dirname, '..', 'afterglow-app', 'dist', 'index.html');
  const devServerUrl = 'http://localhost:5173';

  const loadRenderer = async () => {
    try {
      await win.loadURL(devServerUrl);
      console.log('Loaded Electron renderer from Vite dev server:', devServerUrl);
      return;
    } catch (error) {
      console.warn('Vite dev server not available, falling back to built app:', error.message);
    }

    try {
      await fs.access(rendererPath);
      await win.loadFile(rendererPath);
      console.log('Loaded Electron renderer from built app:', rendererPath);
    } catch (error) {
      console.error('Failed to load renderer', error);
      dialog.showErrorBox('Unable to load app', 'The app could not be loaded. Start the Vite dev server or build the renderer.');
    }
  };

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error('Renderer failed to load:', errorCode, errorDescription);
  });

  loadRenderer();
}

// Users
ipcMain.handle('add-user', (_event, name, email) => {
  return addUser(name, email);
});

ipcMain.handle('get-user', (_event, email) => {
  return getUser(email);
});

// Mixtapes
ipcMain.handle('add-mixtape', (_event, title, fromID) => {
  return addMixtape(title, fromID);
});

ipcMain.handle('get-all-mixtapes', () => {
  return getAllMixtapes();
});

// Songs
ipcMain.handle('add-song', (_event, mixtapeID, youtubeURL, spotifyURL, appleMusicURL, songTitle, songArtist, duration, position) => {
  return addSong(mixtapeID, youtubeURL, spotifyURL, appleMusicURL, songTitle, songArtist, duration, position);
});

// Polaroids
ipcMain.handle('add-polaroid', (_event, songID, imagePath, caption, flipTimestamp, position) => {
  return addPolaroid(songID, imagePath, caption, flipTimestamp, position);
});

// Stickers
ipcMain.handle('add-sticker', (_event, name, imagePath) => {
  return addSticker(name, imagePath);
});

ipcMain.handle('get-all-stickers', () => {
  return getAllStickers();
});

ipcMain.handle('add-sticker-placement', (_event, polaroidID, stickerID, xPercent, yPercent, rotationDegrees, scale) => {
  return addStickerPlacement(polaroidID, stickerID, xPercent, yPercent, rotationDegrees, scale);
});

// initializes the database and sends path to the folder where the user stores their data/files for the app
app.whenReady().then(() => {
  init(app.getPath('userData'));
  console.log('database location: ', app.getPath('userData'));
  createWindow();
});