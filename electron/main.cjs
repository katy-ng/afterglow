// Electron entry point (desktop/Node.js side)

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const { 
    db, 
    init,
    addUser, getUser, 
    addMixtape, getAllMixtapes, 
    addSong, 
    addPolaroid, 
    addSticker, addStickerPlacement 
} = require('../backend/data/database.cjs');

// initializes the database and sends path to the folder where the user stores their data/files for the app  
app.whenReady().then(()=>{
    db.init(app.getPath("userData"));
});

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs')
    }
  });
  win.loadURL('http://localhost:5173'); // Vite's default port
}

// Users
ipcMain.handle("add-user", (event, name, email) => {
    return addUser(name, email);
});

ipcMain.handle("get-user", (event, email) => {
    return getUser(email);
});

// Mixtapes
ipcMain.handle("add-mixtape", (event, title, fromID) => {
    return addMixtape(title, fromID);
});

ipcMain.handle("get-all-mixtapes", () => {
    return getAllMixtapes();
});

// Songs
ipcMain.handle("add-song", (event, mixtapeID, youtubeURL, spotifyURL, appleMusicURL, songTitle, songArtist, duration, position) => {
    return addSong(mixtapeID, youtubeURL, spotifyURL, appleMusicURL, songTitle, songArtist, duration, position);
});

// Polaroids
ipcMain.handle("add-polaroid", (event, songID, imagePath, caption, flipTimestamp, position) => {
    return addPolaroid(songID, imagePath, caption, flipTimestamp, position);
});

// Stickers
ipcMain.handle("add-sticker", (event, name, imagePath) => {
    return addSticker(name, imagePath);
});

ipcMain.handle("add-sticker-placement", (event, polaroidID, stickerID, xPercent, yPercent, rotationDegrees, scale) => {
    return addStickerPlacement(polaroidID, stickerID, xPercent, yPercent, rotationDegrees, scale);
});

app.whenReady().then(() => {
    console.log('database location: ', app.getPath('userData'));
    createWindow();
});