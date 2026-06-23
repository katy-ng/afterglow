// used as an IPC bridge for Electron

const { contextBridge,ipcRenderer } = require("electron");

// Functions that access the database
contextBridge.exposeInMainWorld("db", { 
    addUser: (name, email) =>  ipcRenderer.invoke("add-user", name, email),
    getUser: (email) =>  ipcRenderer.invoke("get-user", email),
    addMixtape: (title, fromID) =>  ipcRenderer.invoke("add-mixtape", title, fromID),
    getAllMixtapes: () =>  ipcRenderer.invoke("get-all-mixtapes"),
    addSong: (mixtapeID, youtuberURL, spotifyURL, appleMusicURL, songTitle, songArtist, duration, position) =>  ipcRenderer.invoke("add-song", mixtapeID, youtuberURL, spotifyURL, appleMusicURL, songTitle, songArtist, duration, position),
    addPolaroid: (songID, imagePath, caption, flipTimestamp, position) =>  ipcRenderer.invoke("add-polaroid", songID, imagePath, caption, flipTimestamp, position),
    addSticker: (name, imagePath) =>  ipcRenderer.invoke("add-sticker", name, imagePath),
    addStickerPlacement: (polaroidID, stickerID, xPercent, yPercent, rotationDegrees, scale) =>  ipcRenderer.invoke("add-sticker-placement", polaroidID, stickerID, xPercent, yPercent, rotationDegrees, scale),
}); 
